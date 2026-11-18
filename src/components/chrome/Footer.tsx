import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
