import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bell, Send } from "lucide-react";
import { SendEmail } from "@/integrations/Core";
import { User } from "@/entities/User";

const MESSAGES = [
  "Good Morning 🌞 Try a quick breakfast today!",
  "It’s lunch time 🍱 Fancy something fresh and light?",
  "It’s dinner time 🍲 Want a surprise recipe?",
  "Snack o’clock 🥨 How about a 5-minute bite?"
];

export default function NotificationsBanner() {
  const [index, setIndex] = React.useState(Math.floor(Math.random() * MESSAGES.length));

  const next = () => {
    setIndex((i) => (i + 1) % MESSAGES.length);
  };

  const sendNow = async () => {
    const me = await User.me();
    await SendEmail({
      to: me.email,
      subject: "Dishlet Daily Suggestion",
      body: `${MESSAGES[index]}\n\nOpen Dishlet to cook something delicious today!`
    });
  };

  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <AlertTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-600" />
            Daily Food Suggestion
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm">
            {MESSAGES[index]}
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={next}>Next</Button>
          <Button size="sm" onClick={sendNow} className="bg-green-600 hover:bg-green-700 gap-2">
            <Send className="w-4 h-4" /> Send me this
          </Button>
        </div>
      </div>
    </Alert>
  );
}