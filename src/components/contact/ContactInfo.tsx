import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function ContactInfo() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>

        <div className="space-y-4">
          <InfoItem icon={<Phone />} label="Phone" value="+91 1800-ROZOMEAL" />
          <InfoItem icon={<Mail />} label="Email" value="partners@rozomeal.com" />
          <InfoItem icon={<MapPin />} label="Address" value="RozoMeal HQ, Mumbai" />
          <InfoItem icon={<Clock />} label="Support Hours" value="24/7 for Partners" />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}
