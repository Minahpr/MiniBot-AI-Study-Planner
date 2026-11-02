/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Minibot is running!");
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const secret = request.headers.get(
      "X-Telegram-Bot-Api-Secret-Token"
    );

    if (
      !env.TELEGRAM_WEBHOOK_SECRET ||
      secret !== env.TELEGRAM_WEBHOOK_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    let update;

    try {
      update = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const message = update.message;

    if (!message || !message.text || !message.from) {
      return new Response("OK");
    }

    const userId = String(message.from.id);

  

    const chatId = message.chat.id;
    const userText = message.text.trim();
    let reply = "متوجه نشدم؛ لطفاً دوباره بنویس.";

    try {
      const aiResult = await env.AI.run(MODEL, {
        messages: [
          {
            role: "system",
            content: `You are a Persian study planning assistant.
Return only a JSON object with fields:
action, title, subject, due_date, task_id, reply.
Allowed actions: add, list, done, undo, del, chat.
Understand Persian messages.
add: add a task and provide its title.
list: show tasks.
done: mark a task complete.
undo: mark a task pending.
del: delete a task.
chat: answer in Persian.
Never invent task IDs.
Use null for unknown task_id.`
          },
          { role: "user", content: userText }
        ],
        max_tokens: 300
      });

      const raw = typeof aiResult.response === "string"
  ? aiResult.response
  : typeof aiResult.output_text === "string"
    ? aiResult.output_text
    : JSON.stringify(aiResult.response ?? aiResult);
const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");

if (start < 0 || end <= start) {
  throw new Error("AI did not return JSON");
}


      const decision = JSON.parse(raw.slice(start, end + 1));
      reply = decision.reply || reply;

      if (decision.action === "add") {
        if (!decision.title) {
          reply = "اسم کاری که می‌خوای اضافه کنی چیه؟";
        } else {
          await env.DB.prepare(
            `INSERT INTO tasks (user_id, title, subject, due_date)
             VALUES (?, ?, ?, ?)`
          ).bind(
            userId,
            String(decision.title).slice(0, 200),
            decision.subject || null,
            decision.due_date || null
          ).run();

          reply = `کار «${decision.title}» اضافه شد.`;
        }
      } else if (decision.action === "list") {
        const result = await env.DB.prepare(
          `SELECT id, title, subject, due_date, status
           FROM tasks
           WHERE user_id = ?
           ORDER BY id DESC
           LIMIT 20`
        ).bind(userId).all();

        const tasks = result.results || [];

        reply = tasks.length
          ? tasks.map(t =>
              `${t.id}. ${t.title} | ${t.subject || "بدون درس"} | ${t.status === "done" ? "انجام‌شده" : "در انتظار"}${t.due_date ? " | " + t.due_date : ""}`
            ).join("\n")
          : "هنوز کاری ثبت نکردی.";
      } else if (
        ["done", "undo", "del"].includes(decision.action)
      ) {
        const id = Number(decision.task_id);

        if (!Number.isSafeInteger(id) || id <= 0) {
          reply = "شمارهٔ کار رو هم مشخص کن؛ مثلاً کار شمارهٔ ۲.";
        } else if (decision.action === "del") {
          const result = await env.DB.prepare(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?"
          ).bind(id, userId).run();

          reply = result.meta.changes
            ? "کار حذف شد."
            : "کاری با این شماره پیدا نکردم.";
        } else {
          const status = decision.action === "done" ? "done" : "pending";

          const result = await env.DB.prepare(
            "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?"
          ).bind(status, id, userId).run();

          reply = result.meta.changes
            ? (status === "done"
                ? "کار انجام‌شده ثبت شد."
                : "کار به حالت انجام‌نشده برگشت.")
            : "کاری با این شماره پیدا نکردم.";
        }
      }
    } catch (error) {
      console.error("Minibot error:", error?.stack || error?.message || String(error));
      reply = "مشکلی پیش اومد؛ لطفاً دوباره امتحان کن.";
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply.slice(0, 4000)
          })
        }
      );

      if (!response.ok) {
        console.error("Telegram sendMessage failed");
      }
    } catch (error) {
      console.error("Telegram request failed:", error);
    }

    return new Response("OK");
  }
};
