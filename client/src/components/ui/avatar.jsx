import { cn, initials } from "../../lib/utils";

export function Avatar({ src, name, className }) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/10 text-sm font-bold text-cyan-100",
        className
      )}
      title={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </div>
  );
}

export function AvatarStack({ users = [], limit = 4 }) {
  const visible = users.slice(0, limit);
  const extra = Math.max(users.length - limit, 0);

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <Avatar
          key={user._id || user.email}
          src={user.avatar}
          name={user.name}
          className="h-8 w-8 border-2 border-background"
        />
      ))}
      {extra ? (
        <div className="grid h-8 w-8 place-items-center rounded-lg border-2 border-background bg-white/10 text-xs font-bold">
          +{extra}
        </div>
      ) : null}
    </div>
  );
}
