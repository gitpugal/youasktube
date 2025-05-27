import React from "react";

const YoutubeFrame = ({ videoId }: { videoId: string }) => {
  return (
    <div className="w-full max-w-3xl aspect-video mb-8 rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl ">
      {videoId ? (
        <iframe
          className="w-full h-full rounded-3xl md:rounded-4xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full bg-[#0b0b0b]  rounded-3xl md:rounded-4xl flex items-center justify-center">
          <p className="text-xs md:text-base text-white/30 text-center">
            Paste a YouTube link to load the video here
          </p>
        </div>
      )}
    </div>
  );
};

export default YoutubeFrame;
