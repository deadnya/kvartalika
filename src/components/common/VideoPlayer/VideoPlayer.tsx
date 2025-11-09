import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "@videojs/http-streaming";

interface VideoPlayerProps {
    src: string; // Path to HLS playlist (e.g., master.m3u8)
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        // Small delay to ensure element is in DOM
        const timer = setTimeout(() => {
            if (!videoRef.current || playerRef.current) return;

            // Initialize the Video.js player
            const player = videojs(videoRef.current, {
                controls: true,
                autoplay: false,
                preload: "auto",
                fluid: true,
                html5: {
                    hls: {
                        overrideNative: true,
                        enableLowInitialPlaylist: true,
                    }
                }
            });

            // Save the player reference
            playerRef.current = player;

            // Attach HLS source to the player
            player.src({
                src,
                type: "application/x-mpegURL",
            });

            // Handle errors
            player.on("error", () => {
                console.error("Player error:", player.error());
            });

            // Use the quality levels plugin
            player.ready(() => {
                const qualityLevels = (player as any).qualityLevels();

                // Add logging for available quality levels
                console.log("Available quality levels:", qualityLevels.levels_);

                qualityLevels.on("change", () => {
                    console.log("Quality level changed to:", qualityLevels.selectedIndex);
                });
            });
        }, 0);

        // Cleanup the Video.js instance on component unmount
        return () => {
            clearTimeout(timer);
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [src]);

    return (
        <div data-vjs-player>
            <video className="video-js vjs-big-play-centered" ref={videoRef} playsInline />
        </div>
    );
};

export default VideoPlayer;