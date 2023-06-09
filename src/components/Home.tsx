import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faGlobeAmericas, faMusic, faNewspaper, faTableTennis } from '@fortawesome/free-solid-svg-icons';

import { PlayerContext } from '../context/PlayerContext';
import { UserContext } from '../context/UserContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { useStations } from '../hooks/useStations';
import useCustomStations from '../hooks/useCustomStations';

import Button from './ui/Button';
import CardsList from './ui/CardsList';
import RadioStationCard from './RadioStationCard';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const playerContext = useContext(PlayerContext);
  const { stations: trending, loading: loadingTrending } = useStations(
    {},
    { limit: 12, sort: 'trending', order: 'desc' }
  );
  const { stations: newest, loading: loadinNewest } = useStations({}, { limit: 12, sort: 'date', order: 'desc' });
  const { user, loading: loadingUser } = useContext(UserContext) || {};
  const { stationHistory, removeStationFromHistory, clearStationHistory } = useContext(NowPlayingContext)!;
  const { addCustomStation, getCustomStations, loading: addingCustomStation } = useCustomStations();

  const playHandler = (station: RadioStation) => playerContext?.play([station]);

  const addHandler = (station: RadioStation) =>
    getCustomStations(station.id)
      .then((result) =>
        result.length
          ? window.confirm(`${station.name} is already in your library. Are you sure you want to replace it?`)
          : true
      )
      .then((result) => (result ? addCustomStation(station) : false));

  return (
    <>
      {!loadingUser && !user && (
        <section className={styles.heroSection}>
          <figure className={styles.heroImg}>
            <img src="/main.svg" alt="Sound wave"></img>
          </figure>
          <header className={styles.header}>
            <h1 className={styles.heroTitle}>Hear the world</h1>
            <p className={styles.heroText}>
              Choose from over 30000 radio stations or <Link to="/auth/signup">register an account</Link> to create your
              own library.
            </p>
            <p className={styles.heroSubText}>
              Already have an account? <Link to="/auth/signin">Click here to sign in.</Link>
            </p>
            <Button
              type="button"
              title="Browse stations"
              className={styles.btnBrowse}
              onClick={() => navigate('/stations/all')}
            >
              Browse stations
            </Button>
          </header>
        </section>
      )}

      <section className={styles.categoriesSection}>
        {user && (
          <Link to="/stations/custom" className={styles.category}>
            <FontAwesomeIcon icon={faFolder} className={styles.categoryIcon} />
            <p className={styles.categoryName}>My Stations</p>
          </Link>
        )}
        <Link to="/stations/music/genres" className={styles.category}>
          <FontAwesomeIcon icon={faMusic} className={styles.categoryIcon} />
          <p className={styles.categoryName}>Music</p>
        </Link>
        <Link to="/stations/genres/news" className={styles.category}>
          <FontAwesomeIcon icon={faNewspaper} className={styles.categoryIcon} />
          <p className={styles.categoryName}>News</p>
        </Link>
        <Link to="/stations/genres/sports" className={styles.category}>
          <FontAwesomeIcon icon={faTableTennis} className={styles.categoryIcon} />
          <p className={styles.categoryName}>Sports</p>
        </Link>
        <Link to="/stations/countries" className={styles.category}>
          <FontAwesomeIcon icon={faGlobeAmericas} className={styles.categoryIcon} />
          <p className={styles.categoryName}>Countries</p>
        </Link>
      </section>

      <section className={styles.recommendedSection}>
        {!!stationHistory?.length && (
          <div className={styles.recommended}>
            <div className={styles.playHistoryTitleContainer}>
              <h3 className={styles.recommendedTitle}>Recently played</h3>
              <Button
                type="button"
                disabled={!stationHistory?.length}
                className={styles.btnClear}
                onClick={() => clearStationHistory()}
              >
                Clear
              </Button>
            </div>
            <CardsList>
              {stationHistory.slice(0, 12).map((station) => (
                <RadioStationCard
                  station={{ ...station, isOwner: true }}
                  key={station.id}
                  onPlay={playHandler}
                  onDelete={() => removeStationFromHistory(station.id)}
                />
              ))}
            </CardsList>
          </div>
        )}
        <div className={styles.recommended}>
          <h3 className={styles.recommendedTitle}>Trending</h3>
          <CardsList>
            {trending.map((station) => (
              <RadioStationCard
                disabled={loadingTrending || addingCustomStation}
                station={station}
                key={station.id}
                onPlay={playHandler}
                onAdd={addHandler}
              />
            ))}
          </CardsList>
        </div>
        <div className={styles.recommended}>
          <h3 className={styles.recommendedTitle}>New and updated</h3>
          <CardsList>
            {newest.map((station, i) => (
              <RadioStationCard
                disabled={loadinNewest || addingCustomStation}
                station={station}
                key={station.id}
                onPlay={playHandler}
                onAdd={addHandler}
              />
            ))}
          </CardsList>
        </div>
      </section>
    </>
  );
}
