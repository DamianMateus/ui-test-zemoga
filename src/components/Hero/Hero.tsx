import React from 'react'
import thumbsUp from '../../assets/img/thumbs-up.svg'
import thumbsDown from '../../assets/img/thumbs-down.svg'
import popePng from '../../assets/img/pope-francis.png'
import popePngx2 from '../../assets/img/pope-francis.@2x.png'
import wikipedia from '../../assets/img/wikipedia.svg'

const Hero = () => {
  return (
    <header className="hero">
      <img
        className="hero__background"
        srcSet={`${popePng} 750w, ${popePngx2} 1440w`}
        sizes="(min-width: 750px) 1440px, 100vw"
        src={popePng}
        alt="Pope Francis"
      />
      <div className="max-centered">
        <div className="hero__featured-card">
          <div className="featured-card__glass-background"></div>
          <div className="featured-card__content">
            <p className="featured-card__hairline">What's your opinion on</p>
            <h2 className="featured-card__title">Pope Francis?</h2>
            <p className="featured-card__desc">
              He's talking tough on clergy sexual abuse, or is he just another pervert protector? (thumbs down) or a true pedophile punishing pontiff? (thumbs up)
            </p>
            <p className="featured-card__more-info">
              <a href="http://wikipedia.com">
                <img src={wikipedia} alt="wikipedia logo" />
                More information
              </a>
            </p>
            <p className="featured-card__cta">
              What's Your Verdict?
            </p>
            <div className="featured-card__buttons">
              <button className="icon-button" aria-label="thumbs up">
                <img src={thumbsUp}alt="thumbs up" />
              </button>
              <button className="icon-button" aria-label="thumbs down">
                <img src={thumbsDown} alt="thumbs down" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hero__closing-gauge">
        <div className="closing-gauge__left">
          <span className="closing-gauge__title">closing in</span>
        </div>
        <div className="closing-gauge__right">
          <span className="closing-gauge__number">22</span>
          <span className="closing-gauge__desc">days</span>
        </div>
      </div>
    </header>
  )
}

export default Hero