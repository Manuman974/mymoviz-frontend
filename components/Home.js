import { useEffect, useState } from 'react';
import { Drawer, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [open, setOpen] = useState(false);  // Contrôle la visibilité du Drawer

  // Hook d'effet requete vers le webservice//
const [NewsMoviesData, setNewsMoviesData] = useState([]);


useEffect(() => {
  fetch('https://mymoviz-backend-ivory-seven.vercel.app/movies')
  .then(response => response.json())
  .then(data => {
    // data.movies va chercher la donnée data.results stocké dans la route//
    setNewsMoviesData(data.movies);
  });
}, []);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesDrawer = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  // Movies list
  const movies = NewsMoviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    // remplacer les données contenu dans le fetch en respectant les .props contenu dans le fichier Movies.js//
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.original_title} overview={data.overview} poster={"https://image.tmdb.org/t/p/w500/" + data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="LogoMyMovies.png" alt="Logo My movies" />
        </div>
        <Button className={styles.button} onClick={() => setOpen(true)}>♥ {likedMovies.length} movie(s)</Button>
        <Drawer className={styles.drawer} title="Liked movies" placement="right" closable={true} onClose={() => setOpen(false)} open={open}>
          {likedMoviesDrawer}
        </Drawer>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;