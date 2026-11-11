import { Carousel, CarouselSlide } from "@/registry/akso/ui/carousel";

const tips = [
  { title: "Use headings", text: "Headings let people jump through a page.", href: "#headings" },
  { title: "Write link text", text: "Say where a link goes, not “click here”.", href: "#links" },
  { title: "Check contrast", text: "Text needs at least 4.5:1 against its background.", href: "#contrast" },
];

/** Demo used by the docs page and by the e2e tests. */
export function CarouselDemo() {
  return (
    <div className="flex max-w-md flex-col gap-8">
      <Carousel label="Accessibility tips">
        {tips.map((tip) => (
          <CarouselSlide key={tip.title}>
            <h2 className="text-lg font-semibold">{tip.title}</h2>
            <p>{tip.text}</p>
            <a href={tip.href} className="self-start rounded-sm text-akso-primary underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring">
              Read more about {tip.title.toLowerCase()}
            </a>
          </CarouselSlide>
        ))}
      </Carousel>
      <Carousel label="News" autoplay interval={4000}>
        <CarouselSlide>
          <p className="font-semibold">Version 0.2.0 is out.</p>
        </CarouselSlide>
        <CarouselSlide>
          <p className="font-semibold">New: OTP field and Stepper.</p>
        </CarouselSlide>
      </Carousel>
    </div>
  );
}
