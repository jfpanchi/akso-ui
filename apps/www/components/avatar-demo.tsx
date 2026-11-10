import { Avatar } from "@/registry/akso/ui/avatar";

/** Demo used by the docs page and by the e2e tests. */
export function AvatarDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar name="Laura Torres" src="/demo/avatar.svg" size="lg" />
        <Avatar name="Mateo Ruiz" />
        <Avatar name="Ana Gómez" src="/demo/missing-picture.png" />
        <Avatar name="Sam Lee" size="sm" />
      </div>
      <ul className="flex flex-col gap-2" aria-label="Team">
        <li className="flex items-center gap-3">
          <Avatar name="Laura Torres" src="/demo/avatar.svg" decorative />
          <span>Laura Torres</span>
        </li>
        <li className="flex items-center gap-3">
          <Avatar name="Mateo Ruiz" decorative />
          <span>Mateo Ruiz</span>
        </li>
      </ul>
    </div>
  );
}
