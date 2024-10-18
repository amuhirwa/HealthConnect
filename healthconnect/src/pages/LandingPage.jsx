import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Administrators from "../assets/Administrators.jpeg";
import Deolinda from "../assets/Deolinda.jpeg";
import Doctor_01 from "../assets/Doctor-1.jpeg";
import Doctor_02 from "../assets/Doctor-2.jpeg";
import Gabriel from "../assets/Gabriel.jpeg";
import Insurer from "../assets/Insurer.jpeg";
import Lenine from "../assets/Lenine.jpeg";
import Patients from "../assets/Patients.jpeg";
import Provider from "../assets/Provider.jpeg";
import Video from "../assets/video.jpeg";
import Michael from "../assets/Michael.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div>
      <header className="header">
        <div className="logo">
          Health<span>Connect</span>
        </div>
        <nav>
          <button onClick={handleRegister} className="btn signup">Sign Up</button>
          <button onClick={handleLogin} className="btn login">Log In</button>
        </nav>
      </header>

      <main className="homepage">
        <IntroSection />
        <SignupSection />
        <MissionSection />
        <OfferingsSection />
        <StatsSection />
      </main>

      <Footer />
    </div>
  );
};

const IntroSection = () => (
  <div className="intro-section">
    <img src={Doctor_01} alt="Doctor" className="intro-image" />
    <div className="intro-text">
      <h1 style={{ fontSize: 30 }}>
        Tired of spending 2 hours for a 8 minutes consultation?
      </h1>
      <p>
        <strong>Welcome to the solution.</strong>
        <br />
        Our mission at <span className="highlight">HealthConnect</span> is to
        revolutionize healthcare accessibility by leveraging cutting-edge
        technology to provide seamless, secure, and efficient telemedicine
        services.
      </p>
    </div>
  </div>
);

const SignupSection = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/register");
  };
  return (
    <div className="signup-section">
      <div className="signup-text">
        <p>
          Join HealthConnect today and experience the future of healthcare,
          where quality consultations are just a click away!
        </p>
        <button onClick={handleSignUp} className="btn signup">Sign Up</button>
      </div>
      <img
        style={{ width: "36%" }}
        src={Doctor_02}
        alt="Consultation"
        className="signup-image"
      />
    </div>
  );
};

const MissionSection = () => (
  <div className="mission-section">
    <img src={Video} alt="Mission" className="mission-image" />
    <div className="mission-text">
      <h2>HealthConnect Mission</h2>
      <p>
        Our mission at HealthConnect is to revolutionize healthcare delivery by
        providing an accessible, efficient, and high-quality telemedicine
        platform. We strive to transform the healthcare landscape, making care
        delivery more accessible, efficient, and patient-centric.
      </p>
    </div>
  </div>
);

const OfferingsSection = () => (
  <div className="offerings-section">
    <h2>Explore what we offer:</h2>
    <div className="offerings">
      <Offering
        title="For Providers"
        description="Our comprehensive platform allows healthcare providers to deliver quality care efficiently."
        image={Provider}
      />
      <Offering
        title="For Patients"
        description="Our platform ensures convenient access to healthcare services from the comfort of your home."
        image={Patients}
      />
      <Offering
        title="For Insurers"
        description="Seamless integration with health insurance providers for efficient billing and claims processing."
        image={Insurer}
      />
      <Offering
        title="For Health Administrators"
        description="Manage consultations, prescriptions, and patient records with ease."
        image={Administrators}
      />
    </div>
  </div>
);

const Offering = ({ title, description, image }) => (
  <div className="offering">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
    <button className="btn offering-btn">{title.replace("For ", "")}</button>
  </div>
);

const StatsSection = () => (
  <div className="stats-section">
    <Stat title="150+" description="Users" />
    <Stat title="200+" description="Consultations" />
    <Stat title="50+" description="Positive Reviews" />
    <Stat title="20+" description="Healthcare Professionals" />
  </div>
);

const Stat = ({ title, description }) => (
  <div className="stat">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <p>Join our newsletter to stay up to date on features and releases.</p>
    <input type="email" placeholder="Email address" />
    <button className="btn subscribe-btn">Subscribe</button>
    <div className="footer-nav">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Settings</a>
    </div>
    <p>&copy; HealthConnect.</p>
  </footer>
);

export default LandingPage;
