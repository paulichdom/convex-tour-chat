'use node';
import OpenAI from 'openai';
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a terse bot in a group chat responding to questions with 1-sentence answers.',
        },
        {
          role: 'user',
          content: args.messageBody,
        },
      ],
    });

    const messageContent = response.choices[0].message?.content;

    await ctx.runMutation(api.messages.send, {
      author: 'ChatGPT',
      body: messageContent || "Sorry, I don't have an answer for that",
    });
  },
});
