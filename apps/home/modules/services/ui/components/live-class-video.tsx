"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface LiveClassVideoProps {
    subject: string;
}

export default function LiveClassVideo({ subject }: LiveClassVideoProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const getVideoUrl = (subject: string) => {
        switch (subject) {
            case "Physics":
                return "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61577904059012%2Fvideos%2F2031690294058129%2F&show_text=false&width=560&t=0"
            case "Biology":
                return "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61577904059012%2Fvideos%2F2854910988047233%2F&show_text=false&width=560&t=0";
            case "Chemistry":
                return "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61577904059012%2Fvideos%2F1416494760016239%2F&show_text=false&width=560&t=0"
            default:
                return "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61577904059012%2Fvideos%2F909468318692187%2F&show_text=false&width=560&t=0"
        }
    };

    const videoUrl = getVideoUrl(subject);

    if (!videoUrl) return null;

    return (
        <div
            style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                backgroundColor: "#000",
            }}
        >
            {!isPlaying ? (
                <>
                    {/* Thumbnail/Placeholder */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Play Button */}
                        <button
                            onClick={handlePlay}
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                border: "none",
                                borderRadius: "50%",
                                width: "80px",
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                            }}
                        >
                            <Play
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    marginLeft: "4px",
                                    fill: "#667eea",
                                    color: "#667eea",
                                }}
                            />
                        </button>
                    </div>
                </>
            ) : (
                <iframe
                    src={`${videoUrl}&autoplay=true`}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            )}
        </div>
    );
}