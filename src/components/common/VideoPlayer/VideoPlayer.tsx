import { useEffect, useRef } from "react";
import Plyr from "plyr";
import Hls from "hls.js";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
    src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<Plyr | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        // Initialize HLS.js for HLS streams
        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Get available quality levels
                const availableQualities = hls.levels.map((level) => level.height);
                availableQualities.unshift(0); // Add "Auto" option

                // Initialize Plyr with quality options
                const player = new Plyr(video, {
                    controls: [
                        "play-large",
                        "play",
                        "progress",
                        "current-time",
                        "mute",
                        "volume",
                        "settings",
                        "fullscreen",
                    ],
                    settings: ["quality"],
                    quality: {
                        default: 0,
                        options: availableQualities,
                        forced: true,
                        onChange: (quality: number) => {
                            if (quality === 0) {
                                // Auto quality
                                hls.currentLevel = -1;
                            } else {
                                // Find the level with matching height
                                const levelIndex = hls.levels.findIndex(
                                    (level) => level.height === quality
                                );
                                if (levelIndex !== -1) {
                                    hls.currentLevel = levelIndex;
                                }
                            }
                        },
                    },
                    i18n: {
                        qualityLabel: {
                            0: "Авто",
                        },
                    },
                });

                playerRef.current = player;
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Native HLS support (Safari)
            video.src = src;

            const player = new Plyr(video, {
                controls: [
                    "play-large",
                    "play",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "settings",
                    "fullscreen",
                ],
            });

            playerRef.current = player;
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [src]);

    return (
        <video ref={videoRef} playsInline />
    );
};

export default VideoPlayer;