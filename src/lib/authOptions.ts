import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            credits: 50, // default credits
          },
        });
        const newChat = await prisma.chat.create({
          data: {
            userId: newUser.id,
            videoUrl: "https://www.youtube.com/watch?v=rNxC16mlO60",
            videoTranscript:
              " You're about to hold a plank. Just 60 seconds. You know it's coming that tensioning your core, the burning your arms, the mental count down ticking away. You're already thinking I can't do this. I'm going to collapse at 30 seconds. Now imagine you push through that feeling. You hold on. Maybe your body starts shaking. Your mind is screaming. Feel the stop. You tell yourself just one more second and you make it to 60. You're feeling pretty proud of yourself. But then you don't stop at 60 seconds. You don't stop at five minutes. You keep going for an hour, for two hours and then ten hours. Yep, ten hours, ten minutes and ten seconds. That's exactly what George Hood did when he set the world record for the longest plank in history. A feat that most people would not believe possible. I met George eight years ago when he set the record at that time five hours and I'll tell you this. He just looked like the definition of mental toughness. The focus in his eyes was razor sharp and he was drenched in sweat. He was hurting. You could see it in his face, feel it in his body. But he didn't stop. Later I asked him, George, how do you do it? His answer surprised me. The plank is 90% mental. George told me he kept his mind busy, distracting himself by focusing on the conversations in the room, drying energy from the people around him. But there was something deeper happening here. We often think of grit as that mental toughness that helps people achieve extraordinary things like ultramarathoners finishing races with broken bones. But here's the twist. It isn't just about willpower. It's rooted in biology. And the most powerful indicator to date is approaching that we're just starting to understand called brain derived neurotrophic factor or BDNF. Think of BDNF as fertilizer for your brain. A protein that helps neurons, the cells in your brain grow, stay healthy and communicate more effectively. This protein is crucial for things like memory and mental resilience. Many things increase BDNF, including sunshine, blueberries, and antidepressants. Exercise increases BDNF the most. And the plank, yes, that simple yoga pose, just might be one of the best exercises for building mental toughness. I'm a clinical professor and diplomat in the Department of Preventive Medicine at UCSD. I've been doing clinical research for over 40 years. In the clinic, many of the patients I care for are so called medically destitute. Some had a heart attack or stroke in their 40s. Some experienced a herrific accident in their 20s, rendering them unemployable, stripping them of everything, and leaving them with chronic pain or disability, and a heavy dose of despair. In no way am I suggesting something as basic as a plank can fix these conditions, but more research is warranted to learn the potential benefits. What makes the concept of grit and BDNF so compelling to me are real life examples of individuals enduring these devastating conditions. Researchers and clinicians still have a lot of questions about grit and the plank. No one has ever studied BDNF during a plank. Yep. What we know is this, the most effective exercises for raising BDNF levels are those requiring mental effort. If you've ever done a plank, you know how quickly mental effort it is required. That, along with what we've learned from George, leads us to believe the plank may be one of the most efficient and effective ways of increasing BDNF. You see, grit is not just for planks, and BDNF is not just a theory. It's back by science. A 2005 article in the aptly named journal HIPPLE campus described an animal study in which exhausting physical exercises like continuous swimming produced less BDNF than exercise that required mental focus, like navigating mazes, in people activities such as yoga, evolved things, that combined physical effort and concentration have produced some of the highest levels of BDNF ever measured. Currently, I'm designing a study for people like Daniel to see if the plank relieves pain. Daniel suffers from a very rare condition known as complex regional pain syndrome or CRPS which is infamous as one of the most painful diseases. There is no known cure. As one patient said, the slight sensation of water dripping on my foot feels like hot lead. Despite living with this excruciating pain, Daniel managed to do a plank for over nine hours. On his CRPS arm, think about that for a minute. Most physically and mentally challenging exercises helped one of the most painful conditions. Now we have evidence that an important part of the answer lies in BDNF. In August of 2024, an article appeared in experimental neurobiology titled Modulation of BDNF by physical exercise. They found exercise doubled the level of BDNF. I am here to raise awareness so that this relationship between exercise, BDNF and improving the quality of life may be studied further. BDNF is hot in the research world. I'm about to make it hotter. George Daniel and my patients deserve as much. Now I'm going to leave you with the challenge. The next time you feel you need more grit in your life, do a plank. If you can't get on the floor, do it against a wall. It only takes a minute, but that minute can be transformative. Thank you.",
            videoSummary:
              '# Summary: The Secrets and Science of Mental Toughness | Joe Risser MD, MPH | TEDxSanDiego\n\nThis talk explores mental toughness, using the example of holding a plank, starting with the incredible feat of George Hood, who held a plank for over 10 hours to set a world record. George revealed that the plank is "90% mental," relying on distraction and drawing energy from others, highlighting that grit isn\'t just about willpower.\n\nThe speaker, Dr. Joe Risser, a clinical professor, introduces the biological basis of mental toughness: **Brain Derived Neurotrophic Factor (BDNF)**.\n\n*   **What is BDNF?** Think of it as "fertilizer" for the brain. It\'s a protein that helps neurons grow, stay healthy, and communicate effectively, crucial for memory and mental resilience.\n*   **What increases BDNF?** Many things like sunshine, blueberries, and antidepressants. **Exercise** increases it the most.\n*   **Which exercise is best for BDNF?** Research suggests that exercises requiring **mental effort** are most effective. While studies on BDNF during a plank are needed, the mental intensity of holding a plank, coupled with examples like George Hood, suggests it could be a highly efficient way to boost BDNF. Studies comparing exhausting exercise (like continuous swimming) with mentally focused exercise (like navigating mazes) in animals support this, showing more BDNF from the mentally challenging tasks. Activities combining physical effort and concentration, like yoga, have also shown high BDNF levels in people.\n\nDr. Risser shares compelling real-life examples from his clinical work, including patients dealing with severe chronic pain or disability. He mentions designing a study for patients like Daniel, who suffers from Complex Regional Pain Syndrome (CRPS), known as one of the most painful conditions. Despite excruciating pain, Daniel managed to hold a plank for over nine hours on his affected arm, suggesting a link between mentally challenging exercise and potential pain relief, possibly mediated by BDNF.\n\nThe talk emphasizes that grit and BDNF are backed by science, citing recent research showing exercise can significantly increase BDNF levels. The goal is to raise awareness for further study on the relationship between exercise, BDNF, and improving quality of life, especially for those facing devastating conditions.\n\n**The Challenge:** The next time you feel you need more grit, do a plank. Even a minute can be transformative. You can do it on the floor or against a wall.',
            chatHistory: [],
            title:
              "The Secrets and Science of Mental Toughness | Joe Risser MD, MPH | TEDxSanDiego",
          },
        });
        if (account) {
          account.newChatId = newChat.id.toString();
        }
      }

      return true;
    },

    async session({ session, token }: any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, credits: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          (session.user as any).credits = dbUser.credits;
        }
      }
      if (session.user && token?.newChatId) {
        (session.user as any).newChatId = token.newChatId;
      }
      return session;
    },
    async jwt({ token, account, trigger, session }) {
      if (account?.newChatId) {
        token.newChatId = account.newChatId;
      }
      if (trigger === "update") {
        token.newChatId = null;
      }
      return token;
    },
  },

  pages: {
    signIn: "/signin",
  },

  debug: process.env.NODE_ENV === "development",
};
