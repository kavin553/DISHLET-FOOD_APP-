import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";

export default function ShareButtons({ title, url, text }) {
  const shareData = {
    title: title || "Dishlet Recipe",
    text: text || title || "Check out this recipe on Dishlet!",
    url: url || window.location.href
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={shareNative} className="gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy link">
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}