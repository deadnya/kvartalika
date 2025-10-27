import { useEffect, useRef, useState } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
  description: string;
  height?: string;
  width?: string;
}

const useYmaps = () => {
  const [ymaps, setYmaps] = useState<any>(null);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => setYmaps(window.ymaps));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.onload = () => {
      window.ymaps.ready(() => setYmaps(window.ymaps));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return ymaps;
};

const getResponsiveDimensions = () => {
  if (typeof window === "undefined") {
    return { width: "600px", height: "400px" };
  }

  const width = window.innerWidth;

  if (width <= 360) {
    return { width: "100vw", height: "360px" };
  } else if (width <= 1023) {
    return { width: "calc(100vw - 32px)", height: "400px" };
  } else if (width <= 1366) {
    return { width: "600px", height: "400px" };
  } else {
    return { width: "867px", height: "580px" };
  }
};

const YandexMap = ({ latitude, longitude, description, height, width }: MapProps) => {
  const ymaps = useYmaps();
  const mapRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!ymaps || mapRef.current) return;

    mapRef.current = new ymaps.Map("map", {
      center: [latitude, longitude],
      zoom: 9,
    });

    const placemark = new ymaps.Placemark(
      [latitude, longitude],
      { balloonContent: description },
      { preset: "islands#icon", iconColor: "#374151" }
    );

    mapRef.current.geoObjects.add(placemark);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [ymaps]);

  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;

  return <div id="map" style={{ width: finalWidth, height: finalHeight }}></div>;
};

export default YandexMap;
