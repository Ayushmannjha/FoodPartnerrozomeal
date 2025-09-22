import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage, Language } from "./LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te' as Language, name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn' as Language, name: 'বাংলা', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
      <SelectTrigger className="w-32 border-none bg-transparent">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLang?.flag}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center space-x-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}