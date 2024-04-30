import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { themeAtom, THEMES, Theme } from "../store/themes";
import ControlContainer from "./ControlContainer";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectSeparator } from "./Select";

import styles from "../styles/ThemeControl.module.css";
import useHotkeys from "../util/useHotkeys";
import { paddingAtom } from "../store/padding";

const ThemeControl: React.FC = () => {
  const [currentTheme, setTheme] = useAtom(themeAtom);
  const [padding, setPadding] = useAtom(paddingAtom);

  useEffect(() => {
    if (currentTheme.name === THEMES.vercel.name || currentTheme.name === THEMES.rabbit.name) {
      setPadding(64);
    }
  }, [currentTheme, setPadding]);

  useHotkeys("c", () => {
    const publicThemes = Object.values(THEMES).filter((theme) => !theme.hidden);
    const currentIndex = publicThemes.indexOf(currentTheme);
    if (Object.values(publicThemes)[currentIndex + 1]) {
      setTheme(Object.values(publicThemes)[currentIndex + 1]);
    } else {
      setTheme(Object.values(publicThemes)[0]);
    }
  });

  const { partnerThemes, themes } = React.useMemo(
    () =>
      Object.entries(THEMES).reduce<{ partnerThemes: Theme[]; themes: Theme[] }>(
        (acc, [key, value]) => {
          const themeWithKey = { ...value, key };
          if (value.partner) {
            acc.partnerThemes.push(themeWithKey);
          } else {
            acc.themes.push(themeWithKey);
          }
          return acc;
        },
        { partnerThemes: [], themes: [] }
      ),
    []
  );

  return (
    <ControlContainer title="Theme">
      <Select
        value={`${currentTheme.name}`}
        onValueChange={(value) => {
          const theme = Object.values(THEMES).find(({ name }) => name === value) as Theme;
          setTheme(theme);
        }}
      >
        {partnerThemes.filter((t) => !t.hidden).length > 0 && (
          <>
            <SelectGroup>
              <SelectLabel>Partners</SelectLabel>
              {partnerThemes
                .filter((theme) => !theme.hidden || theme.name === currentTheme.name)
                .map((theme, index) => {
                  return (
                    <SelectItem key={index} value={theme.name}>
                      <SelectPrimitive.SelectItemText>
                        {theme.name === THEMES.vercel.name ? (
                          <span className={styles.themePreview}>
                            <svg className={styles.vercelLogo} height="64" role="img" viewBox="0 0 74 64">
                              <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="white"></path>
                            </svg>
                          </span>
                        ) : theme.name === THEMES.rabbit.name ? (
                          <span className={styles.themePreview}>
                            <svg width="251" height="264" viewBox="0 0 251 264" className={styles.rabbitLogo}>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.03805 1.20001C-0.838946 3.07701 -0.488943 5.98701 4.75606 32.091C12.0111 68.202 13.4271 71.071 36.8251 97.053C53.9701 116.092 55.0331 117.549 57.2761 125.104C59.3941 132.235 59.2411 138.32 56.6431 150.343C54.8311 158.729 54.4601 163.552 54.5161 178C54.6131 202.757 57.5111 213.257 67.2411 224.096C69.5101 226.623 73.3851 232.444 75.8521 237.03C83.5681 251.374 96.2781 262.181 107.094 263.595C109.428 263.9 114.055 263.503 117.375 262.713C122.057 261.599 124.75 261.509 129.375 262.313C139.905 264.144 145.705 263.666 152.278 260.427C160.427 256.411 169.344 247.229 174.614 237.426C176.966 233.051 181.335 226.404 184.322 222.655C193.377 211.293 195.912 201.306 195.927 176.933C195.935 163.288 195.081 155.485 192.24 143.234C190.395 135.278 191.524 126.469 195.331 119.111C196.643 116.575 205.082 106.349 214.082 96.386C237.485 70.482 238.811 67.684 246.384 28.234C250.753 5.47001 251.081 2.81401 249.692 1.42501C248.699 0.432012 247.269 0.105007 245.674 0.505007C242.573 1.28301 201.1 37.097 194.33 44.842C186.78 53.481 183.01 59.038 173.326 75.808C163.803 92.299 159.274 97.672 151.384 101.837C146.383 104.476 146.152 104.5 125.338 104.5C104.524 104.5 104.293 104.476 99.2921 101.837C91.4281 97.686 87.0691 92.452 76.9761 75.044C62.6301 50.299 57.4871 44.327 30.3381 20.884C19.8881 11.86 10.0401 3.47001 8.45306 2.23901C5.23506 -0.258992 2.83305 -0.594994 1.03805 1.20001ZM121.197 236.14C125.372 237.211 127.035 237.135 133.014 235.594C136.842 234.608 140.165 233.994 140.399 234.228C140.634 234.463 139.242 236.505 137.306 238.766C135.371 241.027 132.317 245.493 130.52 248.689C128.723 251.885 126.616 254.5 125.838 254.5C125.06 254.5 122.942 251.865 121.132 248.645C119.321 245.425 116.49 241.085 114.839 239.001C111.248 234.468 111.106 233.584 114.088 234.33C115.326 234.64 118.525 235.454 121.197 236.14Z"
                                fill="white"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span
                            className={styles.themePreview}
                            style={{
                              backgroundImage: `linear-gradient(140deg, ${theme.background.from}, ${theme.background.to})`,
                            }}
                          />
                        )}
                      </SelectPrimitive.SelectItemText>
                      {theme.name}
                    </SelectItem>
                  );
                })}
            </SelectGroup>
            <SelectSeparator />
          </>
        )}
        <SelectGroup>
          {themes.map((theme, index) => (
            <SelectItem key={index} value={theme.name}>
              <SelectPrimitive.SelectItemText>
                <span
                  className={styles.themePreview}
                  style={{
                    backgroundImage: `linear-gradient(140deg, ${theme.background.from}, ${theme.background.to})`,
                  }}
                />
              </SelectPrimitive.SelectItemText>
              {theme.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </Select>
    </ControlContainer>
  );
};

export default ThemeControl;
