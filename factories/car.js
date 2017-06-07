import { getAccumulator } from "../utils/accumulator";
import { shuffle, remove } from "../utils/array";
import { zerofill } from "../utils/number";
import debug from 'debug';

const log = debug("test-server.factories.car");

const TAGS = Object.freeze(["economy", "business", "vip"]);

const getTags = () => {
  const tags = shuffle([...TAGS]);
  remove(tags, Math.floor(Math.random() * tags.length));
  return tags;
};

export const generateOne = () => {
  const id = getAccumulator(),
        license_plate = `A${zerofill(id, 3)}AA777`,
        online = Math.random() > .5,
        tags = getTags();
  const car = { id, license_plate, online, tags};
  log("Generated", JSON.stringify(car));
  return car;
};

export const generateFew = (amount=0) => {
  const list = [];
  for (;amount > 0; amount--)
    list.push(generateOne());
  log(`Generated ${list.length} cars`);
  return list;
};
