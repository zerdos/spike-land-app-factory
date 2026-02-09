import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { Box } from 'https://testing.spike.land/live/box';
import { useState, useEffect } from 'react';

const App = () => {
  const [counter, setCounter] = useState(10);
  const [scale, setSize] = useState(location.href.endsWith('hydrated') ? 1.1 : 1);
  useEffect(() => {
    const interval = setInterval(() => setCounter((x) => x - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (location.href.endsWith('hydrated') && counter === 0) {
    const now = location.href.split(`/`);
    now.pop();

    location.href = now.join('/');
  }
  return (
    <>
      <motion.div
        css={css`
          transform-origin: '100 100',
          aspect-ratio: 1,
        `}
        initial={{ rotate: -counter, scale: 1 }}
        animate={{ rotate: counter, scale: scale }}
        transition={{
          repeat: 1,

          repeatType: 'mirror',
          type: 'tween',
        }}>
        <Box>
          <span css={css`font-size: 3em;`}>♻️</span>
        </Box>
      </motion.div>
      <p>
        Hey you! Try to <code>this </code> page.
        {location.pathname}
      </p>
      <Box>
        <a
          href={'/live/code-main'}
          css={css`
                color: red;
                :hover{
                  cursor:pointer;
                }
              `}
          onClick={() =>
            (location.href = `${location.pathname}`.split('/').slice(0, 3).join('/'))
          }>
          the code ddddddd tor! (...{counter})
        </a>
      </Box>
    </>
  );
};

export default () => (
  <>
    <div
      css={css`
          background-image: radial-gradient(circle,#226347,#00575d,#00456f,#002d69,#440044);
          font-size: 2em;
          height: 100%;
          display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          justify-items: space-between;
          flex-direction: column;
       `}>
      <App />
    </div>
  </>
);
