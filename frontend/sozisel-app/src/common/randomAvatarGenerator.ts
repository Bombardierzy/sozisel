function decToHexColor(colorNumber: number): string {
  return `${colorNumber.toString(16).padStart(6, "0")}`;
}

function getBinaryList(number: number, size: number): string[] {
  return number.toString(2).padStart(size, "0").split("");
}

function parseAvatarData(data: string, separator: string) {
  const ret: {
    xAxis: number;
    yAxis: number;
    colorMap: string[];
  } = {
    xAxis: 0,
    yAxis: 0,
    colorMap: [],
  };

  if (!data) {
    return ret;
  }

  data.split(separator).forEach((element, index) => {
    const intVal = parseInt(element, 36);

    switch (index) {
      case 0:
        ret.xAxis = intVal;
        break;
      case 1:
        ret.yAxis = intVal;
        break;

      default:
        ret.colorMap.push(decToHexColor(intVal));
        break;
    }
  });

  return ret;
}

export function generateRandomAvatarData(
  complexity: number = 16,
  avatarDataSeparator: string = "-"
): string {
  const xAxis = Math.floor(Math.random() * Math.pow(2, complexity - 1));
  const yAxis = Math.floor(Math.random() * (Math.pow(2, complexity) - 1)) + 1;

  const rows = getBinaryList(yAxis, complexity);
  let ret = `${xAxis.toString(36)}${avatarDataSeparator}${yAxis.toString(36)}`;
  let color;

  rows.forEach(() => {
    color = Math.floor(Math.random() * 16777215);
    ret += `${avatarDataSeparator}${color.toString(36)}`;
  });

  return ret;
}

export function getAvatarFromData(
  avatarData: string,
  renderMethod: string = "square",
  size: number = 256,
  avatarDataSeparator: string = "-"
): string {
  const { xAxis, yAxis, colorMap } = parseAvatarData(
    avatarData,
    avatarDataSeparator
  );
  const complexity = colorMap.length;
  const resolution = Math.floor(size / complexity);

  if (complexity < 1 || xAxis >= Math.pow(2, complexity)) {
    throw Error("Incorrect avatar data");
  }

  let renderProcess = (
    resolution: number,
    indexX: number,
    indexY: number
  ): string =>
    `M${indexX * resolution},${
      indexY * resolution
    } h${resolution} v${resolution} h${0 - resolution}Z`;

  if (renderMethod === "circle") {
    renderProcess = (resolution, indexX, indexY) => {
      const radius = resolution / 2;
      return `M${indexX * resolution},${
        indexY * resolution + radius
      } a${radius} ${radius} 0 1,1 ${resolution},0 a${radius} ${radius} 0 1,1 -${resolution},0`;
    };
  } else if (typeof renderMethod === "function") {
    renderProcess = renderMethod;
  }

  const rows = getBinaryList(yAxis, complexity);
  const cols = getBinaryList(xAxis, complexity);
  let ret = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${size} ${size}">`;

  rows.forEach((rowItem, indexY) => {
    const draw: string[] = [];
    cols.forEach((colItem, indexX) => {
      if (parseInt(rowItem, 10) ^ parseInt(colItem, 10)) {
        draw.push(renderProcess(resolution, indexX, indexY));
      }
    });
    ret += `<path fill="#${colorMap[indexY]}" d="${draw.join(" ")}"/>`;
  });

  return `${ret}</svg>`;
}

export function getRandomAvatar(
  complexity: number = 16,
  renderMethod: string = "square",
  size = 256
): string {
  const avatarData = generateRandomAvatarData(complexity);
  return getAvatarFromData(avatarData, renderMethod, size);
}
