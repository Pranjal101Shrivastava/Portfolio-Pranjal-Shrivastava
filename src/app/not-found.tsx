import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-in section">
      <div className="wrap wrap-narrow" style={{ textAlign: "center", paddingBlock: 60 }}>
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", marginBottom: 14 }}>
          That page isn&rsquo;t here
        </h1>
        <p className="lede" style={{ marginInline: "auto", marginBottom: 28 }}>
          The link may be out of date, or the page may have moved.
        </p>
        <div className="cta-row" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/projects" className="btn">
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
}
