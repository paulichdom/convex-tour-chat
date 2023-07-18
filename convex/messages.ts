import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

interface Message extends Doc<"messages"> {
  likes: number;
}

export const list = query({
  handler: async ({ db }): Promise<Message[]> => {
    // Grab the most recent messages.
    const messages = await db.query("messages").order("desc").take(100);
    const messagesWithLikes = await Promise.all(
      messages.map(async (m) => {
        const likes = await db
          .query("likes")
          .filter((q) => q.eq(q.field("messageId"), m._id))
          .collect();
        return {
          ...m,
          likes: likes.length,
        };
      })
    );
    // Reverse the list so that it's in chronological order.
    return messagesWithLikes.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async ({ db }, { body, author }) => {
    // Send our message.
    await db.insert("messages", { body, author });
  },
});

export const like = mutation({
  args: { liker: v.string(), messageId: v.id("messages") },
  handler: async ({ db }, { liker, messageId }) => {
    await db.insert("likes", { liker, messageId });
  },
});
