import { ContactHeader } from "../contact/ContactHeader.tsx";
import { PartnerForm } from "../contact/PartnerForm.tsx";
import { ContactInfo } from "../contact/ContactInfo.tsx";
import { ContactImage } from "../contact/ContactImage.tsx";

export function ContactForm() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactHeader />

        <div className="grid lg:grid-cols-2 gap-12">
          <PartnerForm />
          <div className="space-y-8">
            <ContactInfo />
            <ContactImage />
          </div>
        </div>
      </div>
    </section>
  );
}
