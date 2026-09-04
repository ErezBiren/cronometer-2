const sha = process.env.NEXT_PUBLIC_GIT_SHA;

export default function VersionBadge() {
  return (
    <div className="text-center text-[10px] text-gray-400 py-1 select-none">
      {sha ? `v${sha.slice(0, 7)}` : "dev"}
    </div>
  );
}
