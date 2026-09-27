import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <div className="footer-links">
          <a href={profile.links.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          {profile.links.linkedin && !profile.links.linkedin.includes("PLACEHOLDER") && (
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
          )}
          <a href={`mailto:${profile.links.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}
