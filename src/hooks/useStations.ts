import { useEffect, useState } from 'react';
import useRadioApiRandomServer from './useRadioApiRadomServer';

type EndpointStats = {
  name?: string;
  stationcount?: number;
  stations?: number;
};

type StationsFilter = {
  category?: string;
  value?: string;
};

type ListOptions = {
  limit?: string | number;
  offset?: string | number;
  sort?: string;
  order?: string;
};

const routeToApiCategory: any = {
  countries: { stationsEndpoint: 'bycountrycodeexact', statsEndpoint: 'countries' },
  genres: { stationsEndpoint: 'bytag', statsEndpoint: 'tags' },
  search: { stationsEndpoint: 'search', statsEndpoint: '' },
};

const routeToApiSort: { [key: string]: string } = {
  name: 'name',
  popularity: 'clickcount',
  trending: 'clicktrend',
};

export function useStations(
  { category = '', value }: StationsFilter,
  { limit = 60, offset = 0, sort = '', order = 'asc' }: ListOptions
): { totalCount: number; stations: RadioStation[]; error: Error | null; loading: boolean } {
  const apiUrl = useRadioApiRandomServer();
  const [totalCount, setTotalCount] = useState(0);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch stations
  useEffect(() => {
    if (!apiUrl) return;
    setLoading(true);

    // We need the server statistic to get total stations count
    let statsUrl = `${apiUrl}/stats`;
    let stationsUrl = new URL(`${apiUrl}/stations`);

    if (category && value) {
      const { statsEndpoint, stationsEndpoint } = routeToApiCategory[category];
      stationsUrl.pathname += `/${stationsEndpoint}`;
      if (category === 'search') {
        stationsUrl.searchParams.append('name', value);
      } else {
        stationsUrl.pathname += `/${value}`;
        // Instead of server stats get stats about the particular endpoint to get total stations count from
        statsUrl = `${apiUrl}/${statsEndpoint}/${value}`;
      }
    }

    stationsUrl.searchParams.append('order', routeToApiSort[sort] || 'name');
    stationsUrl.searchParams.append('reverse', order === 'desc' ? 'true' : 'false');
    stationsUrl.searchParams.append('limit', +limit > 0 && +limit < 301 ? limit.toString() : '60');
    stationsUrl.searchParams.append('offset', offset.toString());

    if (category !== 'search') {
      fetch(statsUrl)
        .then((res) => res.json())
        // If we are using global server stats we are getting an object instead of array
        .then<EndpointStats[]>((data) => (Array.isArray(data) ? data : [data]))
        .then((stats) => stats.reduce((sum, { stationcount, stations }) => sum + (stationcount || stations || 0), 0))
        .then(setTotalCount)
        .catch();
    }

    fetch(stationsUrl)
      .then((res) => res.json())
      .then((data) => {
        setStations(
          data.map(({ stationuuid, name, favicon, url_resolved }: any) => ({
            id: stationuuid,
            name,
            logo: favicon,
            listenUrl: url_resolved,
          }))
        );
        if (category === 'search') {
          setTotalCount(data.length);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [apiUrl, category, value, limit, sort, order, offset]);

  return { loading, totalCount, stations, error };
}
