import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-200">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed right-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Created by:&#160;<b>Raymond Zhang</b>&#160;&#x1F634;&#x1F634;&#x1F634;
        </p>
      </div>

      <div className="relative mb-8 flex place-items-center">
      <div className="absolute -left-80 bottom-30">
        <Image
          className="relative skew-y-12 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert shadow-sm rounded-xl overflow-hidden opacity-80"
          src="/assets/images/left.jpg"
          alt="Side Image"
          width={300}
          height={250}
          priority
        />
        </div>
        <div className="absolute -right-80 bottom-30">
        <Image
          className="relative -skew-y-12 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert shadow-sm rounded-xl overflow-hidden opacity-80"
          src="/assets/images/right.jpg"
          alt="Side Image"
          width={300}
          height={250}
          priority
        />
        </div>
        <div className="relative group">
        <Image
          className="group-hover:opacity-50 animate-ping absolute dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert shadow-2xl shadow-inner rounded-xl overflow-hidden opacity-0"
          src="/assets/images/home.jpg"
          alt="Home Image"
          width={350}
          height={350}
          priority
        />
        <Image
          className="group-hover: relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert shadow-xl rounded-xl overflow-hidden"
          src="/assets/images/home.jpg"
          alt="Home Image"
          width={350}
          height={350}
          priority
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-slate-300 from-60% opacity-10 rounded-xl hover:opacity-70 transition-colors" />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="/billsplitter"
          className="group backdrop-blur-sm rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Bill Splitter{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          Users input their expenses, then it automatically calculate each individual's share based on the total amount paid and redistribute funds so that everyone contributes equally, ensuring a fair and balanced settlement among all payers.
          </p>
        </a>

        <a
          href="https://render.friendster"
          className="group backdrop-blur-sm rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
          Game Friendster{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          An engaging gaming social network platform, with a robust authentication and user account system for profile customization, friend interactions, and game selection. Including real-time communication and gaming requests, and functionalities such as viewing friends on maps, user matching results, and real-time notifications.
          </p>
        </a>

        <a
          href="https://render.natural-disaster-tracker"
          className="group backdrop-blur-sm rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Natural Disaster Tracker{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          a platform that gathers real-time data on natural calamities worldwide, computes diverse statistical analyses, and presents them through intuitive visualizations.
          </p>
        </a>

        <a
          href="https://..."
          className="group backdrop-blur-sm rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            None{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            None...........
          </p>
        </a>
      </div>
    </main>
  );
}
