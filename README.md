# Lynching in Latin America (LYLA)

Web application repo for the project on Lynching events in Latin America. It is a website that facilitates the exploration of the [LYLA dataset](https://css.ethz.ch/en/research/datasets/lynching-in-latin-america.html)

The website is hosted in Github using [Github Pages](https://pages.github.com/)

## Installation and Setup Instructions

### Development

Install all packages:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

Deploy the website to Github pages:

```bash
npm run deploy
```

## Development information
### Important data files

- [/public/countries](https://github.com/css-ethz/lyla/tree/master/public/countries) Geojson with simplified shapefiles for provinces
- [/src/data/events_data.json](https://github.com/css-ethz/lyla/blob/master/src/data/events_data.json) Reported cases
- [/src/data/LatinAmerica_geo_variables_provinces.csv](https://github.com/css-ethz/lyla/blob/master/src/data/LatinAmerica_geo_variables_provinces.csv) Raw file with population data
- [/src/data/population_admin0.json](https://github.com/css-ethz/lyla/blob/master/src/data/population_admin0.json) Population country level, output of the script [01_data_per_million](https://github.com/css-ethz/lyla/blob/master/01_data_per_million.py)
- [/src/data/data_agg.json](https://github.com/css-ethz/lyla/blob/master/src/data/data_agg.json) Cases per million inhabitants, output of the script [01_data_per_million](https://github.com/css-ethz/lyla/blob/master/01_data_per_million.py)


## Contributors

Creators of the dataset
[Enzo Nussio](https://css.ethz.ch/en/center/people/nussio-enzo.html) and [Govinda Clayton](https://css.ethz.ch/en/center/people/clayton-govinda.html)

Creators of the website
[Cristina Guzman](https://cristyguzman.github.io/) and [Fernando Gonzalez](https://feradauto.github.io/)
