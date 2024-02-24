import Carousel from "react-bootstrap/Carousel";
import "./index.css";
const Home = () => {
  return (

    <div>
      <div className="video-container">
        <video className="video-background" autoPlay muted controls loop>
          <source
            src="https://res.cloudinary.com/dycpjbdto/video/upload/v1708783111/km_farah_720p_50f_20240224_142639_lkpe5z.3gp"
            type="video/mp4"
          />
        </video>
      </div>

    <div style={{objectFit:"contain"}}>
      <video className="w-100" autoPlay loop muted>
      <source
        src="https://mdbootstrap.com/img/video/animation-intro.mp4"
        type="video/mp4"
      />
    </video>

    <div className="slider_scroll_down icon-down"></div>

    </div>

  );
};

export default Home;
