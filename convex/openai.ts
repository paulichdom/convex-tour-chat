'use node';
import OpenAI from 'openai';
import { action } from './_generated/server';
import { v } from 'convex/values';

const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {},
});
