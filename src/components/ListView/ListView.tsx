import React, { useState, useEffect } from 'react';
import './listView.css';
import dataPersonOfInterest from '../../assets/data.json'
import thumbsUp from '../../assets/img/thumbs-up.svg'
import thumbsDown from '../../assets/img/thumbs-down.svg'

interface Votes {
  positive: number;
  negative: number;
}

interface PersonData {
  name: string;
  description: string;
  category: string;
  picture: string;
  lastUpdated: string;
  votes: Votes;
  hasVoted: boolean;
}

interface PersonOfInterestType {
  data: PersonData[];
}

const ListView = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedVote, setSelectedVote] = useState<'positive' | 'negative' | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [selectedVotes, setSelectedVotes] = useState<Array<{ person: string, vote: string }>>([]);
  const [personOfInterest, setPersonOfInterest] = useState<PersonOfInterestType | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const storedPersonOfInterest = localStorage.getItem('personOfInterest');
    if (storedPersonOfInterest || storedPersonOfInterest != null) {
      const parsedData = JSON.parse(storedPersonOfInterest);
      const updatedData = parsedData.data.map((person: PersonData) => ({
        ...person,
        hasVoted: person.hasOwnProperty('hasVoted') ? person.hasVoted : false,
      }));
      setPersonOfInterest({ data: updatedData });
    } else {
      const initialDataWithHasVoted = dataPersonOfInterest.data.map(person => ({
        ...person,
        hasVoted: false,
      }));

      localStorage.setItem('personOfInterest', JSON.stringify({ data: initialDataWithHasVoted }));
      setPersonOfInterest({ data: initialDataWithHasVoted });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('personOfInterest', JSON.stringify(personOfInterest));
  }, [personOfInterest]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1026);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setViewMode('grid')
    } else {
      setViewMode('list')
    }
  }, [isMobile])

  const handleVoteButtonClick = (hasVoted: boolean) => {
    if (selectedVote && selectedPerson && personOfInterest) {
      const personIndex = personOfInterest.data.findIndex(
        (person) => person.name === selectedPerson
      );
      if (personIndex !== -1) {
        setPersonOfInterest(prevState => {
          if (!prevState) {
            return prevState;
          }
          if (hasVoted) {
            const updatedPersonOfInterest = [...prevState.data];
            updatedPersonOfInterest[personIndex] = {
              ...updatedPersonOfInterest[personIndex],
              votes: {
                ...updatedPersonOfInterest[personIndex].votes,
                [selectedVote]: updatedPersonOfInterest[personIndex].votes[selectedVote],
              },
              hasVoted: hasVoted ? false : true,
            };
            localStorage.setItem('personOfInterest', JSON.stringify(updatedPersonOfInterest));
            return { data: updatedPersonOfInterest };

          } else {
            const updatedPersonOfInterest = [...prevState.data];
            updatedPersonOfInterest[personIndex] = {
              ...updatedPersonOfInterest[personIndex],
              votes: {
                ...updatedPersonOfInterest[personIndex].votes,
                [selectedVote]: updatedPersonOfInterest[personIndex].votes[selectedVote] + 1,
              },
              hasVoted: hasVoted ? false : true,
            };
            localStorage.setItem('personOfInterest', JSON.stringify(updatedPersonOfInterest));
            return { data: updatedPersonOfInterest };

          }

        });
      }
    }
  };


  const handleToggleVote = (voteType: 'positive' | 'negative', name: string) => {
    const existingVote = selectedVotes.find(item => item.person === name);
    if (existingVote) {
      setSelectedVotes(prevVotes => (
        prevVotes.map(item => item.person === name ? { person: name, vote: voteType } : item)
      ));
    } else {
      setSelectedVotes(prevVotes => [...prevVotes, { person: name, vote: voteType }]);
    }
    setSelectedVote(voteType);
    setSelectedPerson(name)
  };

  const formatDateDifference = (lastUpdated: string) => {
    const currentDate = new Date();
    const lastUpdatedDate = new Date(lastUpdated);

    const timeDifference = currentDate.getTime() - lastUpdatedDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 30) {
      return `${daysDifference} days ago in `;
    } else if (daysDifference < 365) {
      const monthsDifference = Math.floor(daysDifference / 30);
      return `${monthsDifference} months ago in `;
    } else {
      const yearsDifference = Math.floor(daysDifference / 365);
      return `${yearsDifference} years ago in `;
    }
  };

  const calculatePercentage = (positiveVotes: number, negativeVotes: number) => {
    const totalVotes = positiveVotes + negativeVotes;
    const positivePercentage = (positiveVotes / totalVotes) * 100;
    const negativePercentage = (negativeVotes / totalVotes) * 100;
    return { positive: positivePercentage.toFixed(2), negative: negativePercentage.toFixed(2) };
  };

  return (
    <div className='listItems'>
      <div className='listItems--header'>
        <div className='listItems--title'>Previous Rulings</div>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value as 'list' | 'grid')} className='select-view'>
          <option value="list">List</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {viewMode == 'list' ?
        <div className={'list-view'}>
          {personOfInterest && personOfInterest.data.map((person: PersonData, index: number) => (
            <div className={`listItem`} key={index}>
              <div className={`listItem--column`}>
                {person.votes.positive > person.votes.negative ?
                  <div className='thumbsUp__container'>
                    <img className='thumbsUp__container--img' src={thumbsUp} alt="positive" />
                  </div>
                  :
                  <div className={`thumbsDown__container`}>
                    <img className='thumbsDown__container--img' src={thumbsDown} alt="negative" />
                  </div>
                }
                <div className={`listItem__container`}>
                  <img src={`/img/${person.picture}`} alt={person.name} className={`person-photo`} />
                  <div className={`listItem__container--description`}>
                    <div className='listItem__container--description--name'>{person.name}</div>
                    <div className='listItem__container--description--text'>{person.description}</div>
                  </div>
                  <div className={`listItem__container--buttons`}>
                    <div className='listItem__container--buttons--time'>{formatDateDifference(person.lastUpdated)} {person.category} </div>
                    <div className='thumbsUp__container--buttons--row'>
                      {!person.hasVoted &&
                        <>
                          <div className={`thumbsUp__container--button ${selectedVotes.find(item => item.person === person.name && item.vote === 'positive') ? 'selected' : ''}`}>
                            <div onClick={() => handleToggleVote('positive', person.name)}>
                              <img src={thumbsUp} className='thumbsUp__container--button--img' alt="thumbs up" />
                            </div>
                          </div>
                          <div className={`thumbsDown__container--button ${selectedVotes.find(item => item.person === person.name && item.vote === 'negative') ? 'selected' : ''}`}>
                            <div onClick={() => handleToggleVote('negative', person.name)}>
                              <img src={thumbsDown} className='thumbsDown__container--button--img' alt="thumbs down" />
                            </div>
                          </div>
                        </>
                      }
                      <div>
                        <button
                          onClick={() => handleVoteButtonClick(person.hasVoted)}
                          className={`listItem__container--buttons--vote ${person.hasVoted ? 'voted' : ''}`}
                        >
                          {person.hasVoted ? 'Vote Again' : 'Vote Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`gauge-bar`}>
                  <div className="gauge-bar--positive" style={{ width: `${calculatePercentage(person.votes.positive, person.votes.negative).positive}%` }}>
                    <img src={thumbsUp} className='gauge-bar--positive--img' alt="thumbs up" />{calculatePercentage(person.votes.positive, person.votes.negative).positive}%
                  </div>
                  <div className="gauge-bar--negative" style={{ width: `${calculatePercentage(person.votes.positive, person.votes.negative).negative}%` }}>
                    {calculatePercentage(person.votes.positive, person.votes.negative).negative}% <img src={thumbsDown} className='gauge-bar--negative--img' alt="thumbs down" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        :
        <div className={'grid-view'}>
          <div className='grid-items-container'>
            {personOfInterest && personOfInterest.data.map((person: PersonData, index: number) => (
              <div className={`gridItem--card`} style={{ backgroundImage: `url(/img/${person.picture})` }} key={index}>
                {person.votes.positive > person.votes.negative ?
                  <div className='thumbsUp__container'>
                    <img className='thumbsUp__container--img' src={thumbsUp} alt="positive" />
                  </div>
                  :
                  <div className={`thumbsDown__container`}>
                    <img className='thumbsDown__container--img' src={thumbsDown} alt="negative" />
                  </div>
                }
                <div className={`gridItem__container`}>
                  <div className={`gridItem__container--description`}>
                    <div className='gridItem__container--description--name'>{person.name}</div>
                    <div className='gridItem__container--description--text'>{person.description}</div>
                  </div>
                  <div className={`gridItem__container--buttons`}>
                    <div className='gridItem__container--buttons--time'>{formatDateDifference(person.lastUpdated)} {person.category} </div>
                    <div className='thumbsUp__container--buttons--row'>
                      {!person.hasVoted &&
                        <>
                          <div className={`thumbsUp__container--button ${selectedVotes.find(item => item.person === person.name && item.vote === 'positive') ? 'selected' : ''}`}>
                            <div onClick={() => handleToggleVote('positive', person.name)}>
                              <img src={thumbsUp} className='thumbsUp__container--button--img' alt="thumbs up" />
                            </div>
                          </div>
                          <div className={`thumbsDown__container--button ${selectedVotes.find(item => item.person === person.name && item.vote === 'negative') ? 'selected' : ''}`}>
                            <div onClick={() => handleToggleVote('negative', person.name)}>
                              <img src={thumbsDown} className='thumbsDown__container--button--img' alt="thumbs down" />
                            </div>
                          </div>
                        </>
                      }
                      <button
                        onClick={() => handleVoteButtonClick(person.hasVoted)}
                        className={`gridItem__container--buttons--vote ${person.hasVoted ? 'voted' : ''}`}
                      >
                        {person.hasVoted ? 'Vote Again' : 'Vote Now'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`gauge-bar`}>
                  <div className="gauge-bar--positive" style={{ width: `${calculatePercentage(person.votes.positive, person.votes.negative).positive}%` }}>
                    <img src={thumbsUp} className='gauge-bar--positive--img' alt="thumbs up" />{calculatePercentage(person.votes.positive, person.votes.negative).positive}%
                  </div>
                  <div className="gauge-bar--negative" style={{ width: `${calculatePercentage(person.votes.positive, person.votes.negative).negative}%` }}>
                    {calculatePercentage(person.votes.positive, person.votes.negative).negative}% <img src={thumbsDown} className='gauge-bar--negative--img' alt="thumbs down" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default ListView;
