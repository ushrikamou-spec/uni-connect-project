import "./home.css";

export default function HomePage() {
  return (
    <div className="uc-home">
      <div className="uc-main">
        <section className="uc-hero" aria-labelledby="hero-title">
          <div className="uc-hero-copy">
            <div className="uc-eyebrow">Built for the NSU community</div>
            <h1 className="uc-title" id="hero-title">
              Academic collaboration, <em>connected.</em>
            </h1>
            <p className="uc-intro">
              UniConnect is a centralized platform designed to bring North South
              University students, faculty members, and counselors
              together—making academic collaboration, project opportunities,
              peer learning, and support easier to access in one place.
            </p>
            <div className="uc-hero-actions">
              <a className="uc-btn uc-btn-primary" href="#introduction">
                Discover UniConnect&nbsp; →
              </a>
              <a className="uc-btn uc-btn-secondary" href="#portals">
                Explore the portals
              </a>
            </div>
          </div>

          <div className="uc-visual" aria-label="University community illustration">
            <div className="uc-orbit"></div>
            <div className="uc-campus-card">
              <div className="uc-campus-icon" aria-hidden="true">⌂</div>
              <h2>Welcome to your campus</h2>
              <p>
                A shared space to connect with classmates, find your people, and
                make the most of university.
              </p>
              <div className="uc-mini-stats">
                <div className="uc-stat">
                  <strong>Connect</strong>
                  <small>Build community</small>
                </div>
                <div className="uc-stat">
                  <strong>Discover</strong>
                  <small>Find opportunities</small>
                </div>
              </div>
            </div>
            <div className="uc-float-chip uc-chip-one">
              <span>✦</span> Campus opportunities
            </div>
            <div className="uc-float-chip uc-chip-two">
              <span>♡</span> Find your community
            </div>
          </div>
        </section>

        <section className="uc-section-wrap" id="introduction" aria-labelledby="intro-title">
          <div className="uc-about-grid">
            <div>
              <div className="uc-section-kicker">Why UniConnect?</div>
              <h2 id="intro-title">One ecosystem for university collaboration.</h2>
              <p>
                University work often depends on scattered social media groups,
                informal messages, and unorganized emails. These disconnected
                channels can make it difficult to form capstone teams, find
                research opportunities, share learning materials, or arrange
                counseling sessions.
              </p>
              <p>
                UniConnect brings these activities into a structured,
                centralized web platform, helping the NSU community spend less
                time coordinating across channels and more time learning,
                creating, and collaborating.
              </p>
            </div>
            <div className="uc-about-panel">
              <h3>What the platform brings together</h3>
              <p>
                <strong>Capstone allocation:</strong> Support collaboration
                around projects such as CSE299 and CSE499.
              </p>
              <p>
                <strong>Research opportunities:</strong> Make it easier to
                discover and pursue research assistantships.
              </p>
              <p>
                <strong>Peer learning:</strong> Share course notes and useful
                academic resources in one organized space.
              </p>
              <p>
                <strong>Counseling access:</strong> Help students find and
                schedule counseling appointments through a clearer process.
              </p>
            </div>
          </div>
        </section>

        <section className="uc-section-wrap" id="portals" aria-labelledby="portals-title">
          <div className="uc-section-kicker">A portal for every role</div>
          <h2 id="portals-title">Designed around the people who make campus work.</h2>
          <p>
            Specialized portals give each community member a clearer path to the
            tools and workflows relevant to them.
          </p>
          <div className="uc-portal-list">
            <article className="uc-portal">
              <div className="uc-symbol" aria-hidden="true">🎓</div>
              <h3>Students</h3>
              <p>
                Explore project teams and research opportunities, exchange
                course resources, and connect with peer learning and counseling
                services.
              </p>
            </article>
            <article className="uc-portal">
              <div className="uc-symbol" aria-hidden="true">📚</div>
              <h3>Faculty Members</h3>
              <p>
                Support capstone collaboration, review applications, and help
                coordinate academic and research opportunities.
              </p>
            </article>
            <article className="uc-portal">
              <div className="uc-symbol" aria-hidden="true">🤝</div>
              <h3>Counselors</h3>
              <p>
                Manage counseling requests and booking workflows through a more
                structured, organized service experience.
              </p>
            </article>
          </div>
        </section>

        <section className="uc-section-wrap" aria-labelledby="features-title">
          <div className="uc-section-kicker">How it works</div>
          <h2 id="features-title">From scattered messages to structured workflows.</h2>
          <div className="uc-feature-list">
            <article className="uc-feature">
              <div className="uc-symbol" aria-hidden="true">🔐</div>
              <h3>Role-based access</h3>
              <p>
                Authentication and dedicated portals tailored to students,
                faculty members, and counselors.
              </p>
            </article>
            <article className="uc-feature">
              <div className="uc-symbol" aria-hidden="true">⚡</div>
              <h3>Applications &amp; bookings</h3>
              <p>
                Clear application and appointment pipelines help make requests
                easier to follow and manage.
              </p>
            </article>
            <article className="uc-feature">
              <div className="uc-symbol" aria-hidden="true">🗂️</div>
              <h3>Shared resources &amp; reviews</h3>
              <p>
                Organized peer resource sharing and review dashboards support
                transparency and coordination.
              </p>
            </article>
          </div>
        </section>

        <section className="uc-closing-cta" id="contact" aria-labelledby="closing-title">
          <h2 id="closing-title">Ready to connect with your campus?</h2>
          <p>
            Bring academic collaboration, peer resources, project opportunities,
            and student support into one shared experience with UniConnect.
          </p>
          <a className="uc-btn" href="/one_login_page">
            Login to UniConnect&nbsp; →
          </a>
        </section>
      </div>

      <footer className="uc-footer">
        © 2026 uni-connect · Bringing campus communities together
      </footer>
    </div>
  );
}
