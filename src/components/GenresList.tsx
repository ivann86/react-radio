import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { DocumentTitleContext } from '../context/DocumentTitleContext';

import Card from './ui/Card';
import CardsList from './ui/CardsList';

const genres = [
  { name: 'Pop & Top 40', tag: 'pop' },
  { name: 'Rock', tag: 'rock' },
  { name: 'Jazz', tag: 'jazz' },
  { name: 'Blues', tag: 'blues' },
  { name: 'Country', tag: 'country' },
  { name: 'Folk', tag: 'folk' },
  { name: 'World', tag: 'world' },
  { name: 'Dance', tag: 'dance' },
  { name: 'House', tag: 'house' },
  { name: '70s', tag: '70s' },
  { name: '80s', tag: '80s' },
  { name: '90s', tag: '90s' },
  { name: '00s', tag: '00s' },
];

export default function GenresList() {
  const { setDocumentTitle } = useContext(DocumentTitleContext)!;

  useEffect(() => {
    setDocumentTitle('Browse stations');
  }, [setDocumentTitle]);

  return (
    <CardsList>
      {genres.map((genre) => (
        <Link to={genre.tag} key={genre.tag}>
          <Card>{genre.name}</Card>
        </Link>
      ))}
    </CardsList>
  );
}
