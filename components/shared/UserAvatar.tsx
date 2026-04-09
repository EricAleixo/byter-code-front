import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type User = {
  name: string;
  avatarUrl?: string | null;
};

interface UserAvatarProps {
  user: User;
  showName?: boolean;
  className?: string;
}

export function UserAvatar({ user, showName = true, className }: UserAvatarProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Avatar className="h-7 w-7 ring-1 ring-violet-700/40">
        <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />

        <AvatarFallback className="bg-linear-to-br from-violet-700 via-violet-700 to-violet-800 text-white text-xs font-bold">
          {user.name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {showName && (
        <span className="text-zinc-300 font-medium truncate max-w-32">
          {user.name}
        </span>
      )}
    </div>
  );
}