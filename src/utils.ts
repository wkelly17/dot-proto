export function formatDuration(milliseconds: number) {
  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format the time string and trim leading zeros
  let timeString = "";

  if (hours > 0) {
    timeString = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (hours == 0 || minutes > 0) {
    timeString = `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    timeString = `0:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return timeString;
}
export function bytesToMegabytes(bytes: number): string {
  const megabytes = bytes / 1024 / 1024;
  const roundedMegabytes = megabytes.toFixed(0);
  return roundedMegabytes;
}
export function getMp4DownloadSize(vid: any) {
  const mp4Vid = vid.sources.find((v: any) => {
    return v.container && v.container == "MP4";
  });
  return bytesToMegabytes(mp4Vid.size);
}
export function convertToValidFilename(string: string) {
  return string.replace(/[\/|\\:*?"<>]/g, " ").replace(" ", "_");
}

export function padLastNumber(input: any): string {
  // Check if the last character is a number
  const lastChar = input.slice(-1);
  if (!isNaN(lastChar)) {
    // If it is, check if it's a single-digit number
    const lastNumber = parseInt(lastChar, 10);
    if (lastNumber >= 0 && lastNumber <= 9) {
      // If it's a single-digit number, pad it with an initial 0
      const paddedNumber = lastNumber < 10 ? `0${lastNumber}` : lastNumber;
      // Return the input string with the padded number
      return input.slice(0, -1) + paddedNumber;
    }
  }
  // If the last character is not a number or is not a single-digit number, return the input string unchanged
  return input;
}

interface ObjectGroup {
  [key: string]: object[];
}

export function groupObjectsByKey<
  T extends {[key: string]: any},
  K extends keyof T
>(objects: T[], key: K): Record<T[K], T[]> {
  const groups = {} as Record<T[K], T[]>;

  // Iterate over each object in the array
  objects.forEach((object) => {
    // Get the value of the specified key
    const value = object[key];

    // If there is no group for the value, create one
    if (!groups[value]) {
      groups[value] = [];
    }

    // Add the object to the corresponding group
    groups[value].push(object);
  });

  return groups;
}
