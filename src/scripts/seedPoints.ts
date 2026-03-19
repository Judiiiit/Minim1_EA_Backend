import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Point from '../models/Point';
import Logging from '../library/Logging';

dotenv.config();

type GeoFeature = {
    type: 'Feature';
    properties: {
        RouteName: number;
        Index: number;
    };
    geometry: {
        coordinates: [number, number];
        type: 'Point';
    };
    id: number;
};

type GeoFeatureCollection = {
    type: 'FeatureCollection';
    features: GeoFeature[];
};

type SeedPoint = {
    _id: string;
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    image?: string;
    routeId: string;
    index: number;
};

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const CITY_ROUTE_IDS: Record<string, [string, string, string]> = {
    Galicia: [
        '66f000000000000000000001',
        '66f000000000000000000002',
        '66f000000000000000000003'
    ],
    Valencia: [
        '66f000000000000000000004',
        '66f000000000000000000005',
        '66f000000000000000000006'
    ],
    Sevilla: [
        '66f000000000000000000007',
        '66f000000000000000000008',
        '66f000000000000000000009'
    ],
    Madrid: [
        '66f00000000000000000000a',
        '66f00000000000000000000b',
        '66f00000000000000000000c'
    ],
    Barcelona: [
        '66f00000000000000000000d',
        '66f00000000000000000000e',
        '66f00000000000000000000f'
    ]
};

// Add future city payloads here (Valencia, Sevilla, etc.)
const CITY_FEATURE_COLLECTIONS: Record<string, GeoFeatureCollection> = {
    Galicia: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', properties: { RouteName: 1, Index: 1 }, geometry: { coordinates: [-8.544642628953028, 42.880421963658904], type: 'Point' }, id: 0 },
            { type: 'Feature', properties: { RouteName: 1, Index: 2 }, geometry: { coordinates: [-8.544687262287908, 42.879490401698774], type: 'Point' }, id: 1 },
            { type: 'Feature', properties: { RouteName: 1, Index: 3 }, geometry: { coordinates: [-8.549071660155846, 42.87867214899504], type: 'Point' }, id: 2 },
            { type: 'Feature', properties: { RouteName: 1, Index: 4 }, geometry: { coordinates: [-8.549393904801235, 42.8774433811727], type: 'Point' }, id: 3 },
            { type: 'Feature', properties: { RouteName: 1, Index: 5 }, geometry: { coordinates: [-8.547455825345708, 42.8798397491374], type: 'Point' }, id: 4 },
            { type: 'Feature', properties: { RouteName: 1, Index: 6 }, geometry: { coordinates: [-8.545747053969393, 42.88052943411225], type: 'Point' }, id: 5 },
            { type: 'Feature', properties: { RouteName: 1, Index: 7 }, geometry: { coordinates: [-8.544107494741525, 42.884199804306235], type: 'Point' }, id: 6 },
            { type: 'Feature', properties: { RouteName: 2, Index: 1 }, geometry: { coordinates: [-8.72628645813623, 42.231663185681185], type: 'Point' }, id: 7 },
            { type: 'Feature', properties: { RouteName: 2, Index: 2 }, geometry: { coordinates: [-8.717908585412175, 42.232098266452596], type: 'Point' }, id: 8 },
            { type: 'Feature', properties: { RouteName: 2, Index: 3 }, geometry: { coordinates: [-8.726683584087937, 42.23677594443146], type: 'Point' }, id: 9 },
            { type: 'Feature', properties: { RouteName: 2, Index: 4 }, geometry: { coordinates: [-8.72293443170264, 42.23691426908346], type: 'Point' }, id: 10 },
            { type: 'Feature', properties: { RouteName: 2, Index: 5 }, geometry: { coordinates: [-8.727769181147806, 42.24060791890403], type: 'Point' }, id: 11 },
            { type: 'Feature', properties: { RouteName: 2, Index: 6 }, geometry: { coordinates: [-8.723234105174214, 42.24103807477846], type: 'Point' }, id: 12 },
            { type: 'Feature', properties: { RouteName: 2, Index: 7 }, geometry: { coordinates: [-8.715241166939165, 42.239042160624564], type: 'Point' }, id: 13 },
            { type: 'Feature', properties: { RouteName: 3, Index: 1 }, geometry: { coordinates: [-8.401594027833795, 43.35039284021582], type: 'Point' }, id: 14 },
            { type: 'Feature', properties: { RouteName: 3, Index: 2 }, geometry: { coordinates: [-8.412523363127349, 43.36191136292342], type: 'Point' }, id: 15 },
            { type: 'Feature', properties: { RouteName: 3, Index: 3 }, geometry: { coordinates: [-8.408829433799497, 43.368625107691315], type: 'Point' }, id: 16 },
            { type: 'Feature', properties: { RouteName: 3, Index: 4 }, geometry: { coordinates: [-8.409727439801458, 43.3839422914144], type: 'Point' }, id: 17 },
            { type: 'Feature', properties: { RouteName: 3, Index: 5 }, geometry: { coordinates: [-8.406555360032627, 43.38593947941166], type: 'Point' }, id: 18 }
        ]
    },
    Valencia: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', properties: { RouteName: 1, Index: 1 }, geometry: { coordinates: [-0.34708883358862863, 39.4529616323623], type: 'Point' }, id: 0 },
            { type: 'Feature', properties: { RouteName: 1, Index: 2 }, geometry: { coordinates: [-0.3516610454911131, 39.45573221394483], type: 'Point' }, id: 1 },
            { type: 'Feature', properties: { RouteName: 1, Index: 3 }, geometry: { coordinates: [-0.3538685964254853, 39.45667031839042], type: 'Point' }, id: 2 },
            { type: 'Feature', properties: { RouteName: 1, Index: 4 }, geometry: { coordinates: [-0.3559217899843361, 39.45802841780588], type: 'Point' }, id: 3 },
            { type: 'Feature', properties: { RouteName: 1, Index: 5 }, geometry: { coordinates: [-0.3569314576930367, 39.46003995992481], type: 'Point' }, id: 4 },
            { type: 'Feature', properties: { RouteName: 2, Index: 1 }, geometry: { coordinates: [-0.3321249019350887, 39.45982452612867], type: 'Point' }, id: 5 },
            { type: 'Feature', properties: { RouteName: 2, Index: 2 }, geometry: { coordinates: [-0.323138399025396, 39.46665340086659], type: 'Point' }, id: 6 },
            { type: 'Feature', properties: { RouteName: 2, Index: 3 }, geometry: { coordinates: [-0.32416361824428463, 39.47883004986221], type: 'Point' }, id: 7 },
            { type: 'Feature', properties: { RouteName: 3, Index: 1 }, geometry: { coordinates: [-0.3764300757420074, 39.474106735829], type: 'Point' }, id: 8 },
            { type: 'Feature', properties: { RouteName: 3, Index: 2 }, geometry: { coordinates: [-0.37673393339474615, 39.47046012593168], type: 'Point' }, id: 9 },
            { type: 'Feature', properties: { RouteName: 3, Index: 3 }, geometry: { coordinates: [-0.38211900451091196, 39.46999011619616], type: 'Point' }, id: 10 },
            { type: 'Feature', properties: { RouteName: 3, Index: 4 }, geometry: { coordinates: [-0.38392611933150533, 39.47571221187533], type: 'Point' }, id: 11 },
            { type: 'Feature', properties: { RouteName: 3, Index: 5 }, geometry: { coordinates: [-0.3867732016183538, 39.47691638496707], type: 'Point' }, id: 12 },
            { type: 'Feature', properties: { RouteName: 3, Index: 6 }, geometry: { coordinates: [-0.3776034124153398, 39.481234604911634], type: 'Point' }, id: 13 }
        ]
    },
    Sevilla: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', properties: { RouteName: 1, Index: 1 }, geometry: { coordinates: [-5.987092094612052, 37.37733694782766], type: 'Point' }, id: 0 },
            { type: 'Feature', properties: { RouteName: 1, Index: 2 }, geometry: { coordinates: [-5.990148725670764, 37.38332790960186], type: 'Point' }, id: 1 },
            { type: 'Feature', properties: { RouteName: 1, Index: 3 }, geometry: { coordinates: [-5.9931595551905446, 37.385771126647256], type: 'Point' }, id: 2 },
            { type: 'Feature', properties: { RouteName: 1, Index: 4 }, geometry: { coordinates: [-5.996305453074399, 37.382419139048366], type: 'Point' }, id: 3 },
            { type: 'Feature', properties: { RouteName: 1, Index: 5 }, geometry: { coordinates: [-5.998437051497973, 37.38590898888695], type: 'Point' }, id: 4 },
            { type: 'Feature', properties: { RouteName: 2, Index: 1 }, geometry: { coordinates: [-6.005828123821146, 37.373711839202386], type: 'Point' }, id: 5 },
            { type: 'Feature', properties: { RouteName: 2, Index: 2 }, geometry: { coordinates: [-6.002389316010152, 37.38631669544054], type: 'Point' }, id: 6 },
            { type: 'Feature', properties: { RouteName: 2, Index: 3 }, geometry: { coordinates: [-6.005478377513384, 37.38324250308183], type: 'Point' }, id: 7 },
            { type: 'Feature', properties: { RouteName: 2, Index: 4 }, geometry: { coordinates: [-6.008223864508267, 37.39102639510479], type: 'Point' }, id: 8 },
            { type: 'Feature', properties: { RouteName: 2, Index: 5 }, geometry: { coordinates: [-6.001816514842432, 37.40788104610981], type: 'Point' }, id: 9 }
        ]
    },
    Madrid: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', properties: { RouteName: 1, Index: 1 }, geometry: { coordinates: [-3.692113848274147, 40.413826264364815], type: 'Point' }, id: 0 },
            { type: 'Feature', properties: { RouteName: 1, Index: 2 }, geometry: { coordinates: [-3.6950363168888316, 40.41628996029263], type: 'Point' }, id: 1 },
            { type: 'Feature', properties: { RouteName: 1, Index: 3 }, geometry: { coordinates: [-3.6831494830379654, 40.41444402335347], type: 'Point' }, id: 2 },
            { type: 'Feature', properties: { RouteName: 1, Index: 4 }, geometry: { coordinates: [-3.688756519494177, 40.42001389547775], type: 'Point' }, id: 3 },
            { type: 'Feature', properties: { RouteName: 1, Index: 5 }, geometry: { coordinates: [-3.6887916378559567, 40.423424100477376], type: 'Point' }, id: 4 },
            { type: 'Feature', properties: { RouteName: 2, Index: 1 }, geometry: { coordinates: [-3.6907801063801458, 40.41104926622941], type: 'Point' }, id: 5 },
            { type: 'Feature', properties: { RouteName: 2, Index: 2 }, geometry: { coordinates: [-3.6974398356683764, 40.41433739052525], type: 'Point' }, id: 6 },
            { type: 'Feature', properties: { RouteName: 2, Index: 3 }, geometry: { coordinates: [-3.6967167656999322, 40.41609560725803], type: 'Point' }, id: 7 },
            { type: 'Feature', properties: { RouteName: 2, Index: 4 }, geometry: { coordinates: [-3.693094658591775, 40.41930363027953], type: 'Point' }, id: 8 },
            { type: 'Feature', properties: { RouteName: 2, Index: 5 }, geometry: { coordinates: [-3.701028799517559, 40.41998074919127], type: 'Point' }, id: 10 },
            { type: 'Feature', properties: { RouteName: 2, Index: 6 }, geometry: { coordinates: [-3.7059084232697046, 40.420094981895375], type: 'Point' }, id: 10 },
            { type: 'Feature', properties: { RouteName: 3, Index: 1 }, geometry: { coordinates: [-3.694674237316093, 40.41880528761155], type: 'Point' }, id: 11 },
            { type: 'Feature', properties: { RouteName: 3, Index: 2 }, geometry: { coordinates: [-3.6909073528469776, 40.424662485293084], type: 'Point' }, id: 12 },
            { type: 'Feature', properties: { RouteName: 3, Index: 3 }, geometry: { coordinates: [-3.7007720999634444, 40.42562445572284], type: 'Point' }, id: 13 },
            { type: 'Feature', properties: { RouteName: 3, Index: 4 }, geometry: { coordinates: [-3.701823866699698, 40.41944241165183], type: 'Point' }, id: 14 },
            { type: 'Feature', properties: { RouteName: 3, Index: 5 }, geometry: { coordinates: [-3.703514563860807, 40.41680858747125], type: 'Point' }, id: 15 }
        ]
    },
    Barcelona: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', properties: { RouteName: 1, Index: 1 }, geometry: { coordinates: [2.1617976428317434, 41.39533443860191], type: 'Point' }, id: 0 },
            { type: 'Feature', properties: { RouteName: 1, Index: 2 }, geometry: { coordinates: [2.164910214855638, 41.391661856267376], type: 'Point' }, id: 1 },
            { type: 'Feature', properties: { RouteName: 1, Index: 3 }, geometry: { coordinates: [2.170031388649676, 41.387025197818275], type: 'Point' }, id: 2 },
            { type: 'Feature', properties: { RouteName: 1, Index: 4 }, geometry: { coordinates: [2.1702162145380157, 41.385264037210845], type: 'Point' }, id: 3 },
            { type: 'Feature', properties: { RouteName: 1, Index: 5 }, geometry: { coordinates: [2.1779189157375356, 41.37582131325132], type: 'Point' }, id: 4 },
            { type: 'Feature', properties: { RouteName: 2, Index: 1 }, geometry: { coordinates: [2.174884530705299, 41.40399635505071], type: 'Point' }, id: 5 },
            { type: 'Feature', properties: { RouteName: 2, Index: 2 }, geometry: { coordinates: [2.1859937469682507, 41.4038023209969], type: 'Point' }, id: 6 },
            { type: 'Feature', properties: { RouteName: 2, Index: 3 }, geometry: { coordinates: [2.180627748789732, 41.391041729761156], type: 'Point' }, id: 7 },
            { type: 'Feature', properties: { RouteName: 2, Index: 4 }, geometry: { coordinates: [2.1863059489565444, 41.38742554945691], type: 'Point' }, id: 8 },
            { type: 'Feature', properties: { RouteName: 2, Index: 4 }, geometry: { coordinates: [2.1895922863343174, 41.37423971034508], type: 'Point' }, id: 9 },
            { type: 'Feature', properties: { RouteName: 3, Index: 1 }, geometry: { coordinates: [2.1720925917932448, 41.38637080502136], type: 'Point' }, id: 10 },
            { type: 'Feature', properties: { RouteName: 3, Index: 2 }, geometry: { coordinates: [2.1760290415619465, 41.38437884014496], type: 'Point' }, id: 11 },
            { type: 'Feature', properties: { RouteName: 3, Index: 3 }, geometry: { coordinates: [2.1770597957415987, 41.38264727214303], type: 'Point' }, id: 12 },
            { type: 'Feature', properties: { RouteName: 3, Index: 4 }, geometry: { coordinates: [2.177230553128908, 41.38337490494271], type: 'Point' }, id: 13 },
            { type: 'Feature', properties: { RouteName: 3, Index: 5 }, geometry: { coordinates: [2.179174351411433, 41.38296726926254], type: 'Point' }, id: 14 },
            { type: 'Feature', properties: { RouteName: 3, Index: 6 }, geometry: { coordinates: [2.1795366194799897, 41.379368523199105], type: 'Point' }, id: 15 }
        ]
    }
};

function makePointObjectId(index: number): string {
    const suffix = index.toString(16).padStart(6, '0');
    return `67f000000000000000${suffix}`;
}

function mapFeatureToSeedPoint(
    feature: GeoFeature,
    city: string,
    routeIdsByCity: [string, string, string],
    pointSeq: number
): SeedPoint {
    const routeName = feature.properties.RouteName;
    if (!Number.isInteger(routeName) || routeName < 1 || routeName > 3) {
        throw new Error(`Invalid RouteName in ${city} (feature id ${feature.id})`);
    }

    const coords = feature.geometry.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) {
        throw new Error(`Invalid coordinates in ${city} (feature id ${feature.id})`);
    }

    const [longitude, latitude] = coords;

    return {
        _id: makePointObjectId(pointSeq),
        name: `point${pointSeq}`,
        description: '',
        latitude,
        longitude,
        image: '',
        routeId: routeIdsByCity[routeName - 1],
        index: feature.properties.Index
    };
}

function buildSeedPoints(): SeedPoint[] {
    const seedPoints: SeedPoint[] = [];
    let pointSeq = 1;

    Object.entries(CITY_FEATURE_COLLECTIONS).forEach(([city, featureCollection]) => {
        const routeIdsByCity = CITY_ROUTE_IDS[city];
        if (!routeIdsByCity) {
            throw new Error(`No routeIds configured for city ${city}`);
        }

        featureCollection.features.forEach((feature) => {
            seedPoints.push(mapFeatureToSeedPoint(feature, city, routeIdsByCity, pointSeq));
            pointSeq += 1;
        });
    });

    return seedPoints;
}

function validateSeedPoints(points: SeedPoint[]) {
    points.forEach((point, index) => {
        if (!point.name || !point.name.trim()) {
            throw new Error(`Invalid name at index ${index}`);
        }

        if (!OBJECT_ID_REGEX.test(point._id)) {
            throw new Error(`Invalid _id at index ${index}`);
        }

        if (!OBJECT_ID_REGEX.test(point.routeId)) {
            throw new Error(`Invalid routeId at index ${index}`);
        }

        if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) {
            throw new Error(`Invalid lat/lng at index ${index}`);
        }

        if (!Number.isInteger(point.index) || point.index < 0) {
            throw new Error(`Invalid index at index ${index}`);
        }
    });
}

async function seedPoints() {
    try {
        const MONGO_URL = process.env.MONGO_URI || '';
        if (!MONGO_URL) {
            throw new Error('MONGO_URI is not configured in .env');
        }

        const pointsToInsert = buildSeedPoints();
        validateSeedPoints(pointsToInsert);

        await mongoose.connect(MONGO_URL, { retryWrites: true, w: 'majority' });
        Logging.info('MongoDB connection established');

        await Point.deleteMany({});
        Logging.info('Points collection cleared');

        if (!pointsToInsert.length) {
            Logging.info('No points defined in CITY_FEATURE_COLLECTIONS');
            process.exit(0);
        }

        const result = await Point.insertMany(pointsToInsert);
        Logging.info('' + result.length + ' points created successfully');

        process.exit(0);
    } catch (error) {
        Logging.error(`Error creating points: ${error}`);
        process.exit(1);
    }
}

seedPoints();
