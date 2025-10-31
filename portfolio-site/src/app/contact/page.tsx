import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Michelle Ackers — Operations Architect.",
};

export default function ContactPage() {
  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="mt-2 text-zinc-300">
        Email me at {" "}
        <a className="text-zinc-100 underline" href="mailto:ackers.ml@gmail.com">
          ackers.ml@gmail.com
        </a>
        , or use the form below.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </section>
  );
}


