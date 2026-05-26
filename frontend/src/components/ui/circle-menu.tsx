'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONSTANTS = {
  itemSize: 48,
  containerSize: 220,
  openStagger: 0.02,
  closeStagger: 0.07
};

const STYLES: Record<string, Record<string, string>> = {
  trigger: {
    container:
      'rounded-full flex items-center bg-white text-black justify-center cursor-pointer outline-none ring-0 hover:brightness-110 transition-all duration-100 z-50 shadow-lg border border-white/20',
    active: 'bg-white text-black'
  },
  item: {
    container:
      'rounded-full flex items-center justify-center absolute bg-zinc-900 text-white hover:bg-zinc-800 border border-white/10 cursor-pointer shadow-lg',
    label: 'text-xs text-white absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap z-50'
  }
};

const pointOnCircle = (i: number, n: number, r: number, cx = 0, cy = 0) => {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2;
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta) + 0;
  return { x, y };
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  index: number;
  totalItems: number;
  isOpen: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon, label, href, index, totalItems, isOpen, onClick }: MenuItemProps) => {
  const { x, y } = pointOnCircle(index, totalItems, CONSTANTS.containerSize / 2);
  const [hovering, setHovering] = useState(false);

  return (
    <div className="absolute" style={{ zIndex: isOpen ? 40 : -10 }}>
      <motion.button
        animate={{
          x: isOpen ? x : 0,
          y: isOpen ? y : 0,
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.5
        }}
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.1,
            delay: 0
          }
        }}
        transition={{
          delay: isOpen ? index * CONSTANTS.openStagger : index * CONSTANTS.closeStagger,
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
        style={{
          height: CONSTANTS.itemSize - 2,
          width: CONSTANTS.itemSize - 2
        }}
        className={STYLES.item.container}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={onClick}
      >
        {icon}
        {hovering && <p className={STYLES.item.label}>{label}</p>}
      </motion.button>
    </div>
  );
};

interface MenuTriggerProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  itemsLength: number;
  closeAnimationCallback: () => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

const MenuTrigger = ({
  setIsOpen,
  isOpen,
  itemsLength,
  closeAnimationCallback,
  openIcon,
  closeIcon
}: MenuTriggerProps) => {
  const animate = useAnimationControls();
  const shakeAnimation = useAnimationControls();

  const scaleTransition = Array.from({ length: itemsLength - 1 })
    .map((_, index) => index + 1)
    .reduce((acc, _, index) => {
      const increasedValue = index * 0.15;
      acc.push(1 + increasedValue);
      return acc;
    }, [] as number[]);

  const closeAnimation = async () => {
    shakeAnimation.start({
      translateX: [0, 2, -2, 0, 2, -2, 0],
      transition: {
        duration: CONSTANTS.closeStagger,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop'
      }
    });
    for (let i = 0; i < scaleTransition.length; i++) {
      await animate.start({
        height: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2
        ),
        width: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2
        ),
        transition: {
          duration: CONSTANTS.closeStagger / 2,
          ease: 'linear'
        }
      });
      if (i !== scaleTransition.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, CONSTANTS.closeStagger * 1000));
      }
    }

    shakeAnimation.stop();
    shakeAnimation.start({
      translateX: 0,
      transition: {
        duration: 0
      }
    });

    animate.start({
      height: CONSTANTS.itemSize,
      width: CONSTANTS.itemSize,
      transition: {
        duration: 0.1,
        ease: 'backInOut'
      }
    });
  };

  return (
    <motion.div animate={shakeAnimation} className="z-50">
      <motion.button
        animate={animate}
        style={{
          height: CONSTANTS.itemSize,
          width: CONSTANTS.itemSize
        }}
        className={cn(STYLES.trigger.container, isOpen && STYLES.trigger.active)}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            closeAnimationCallback();
            closeAnimation();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {isOpen ? (
            <motion.span
              key="menu-close"
              initial={{
                opacity: 0,
                filter: 'blur(10px)'
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)'
              }}
              exit={{
                opacity: 0,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 0.2
              }}
            >
              {closeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="menu-open"
              initial={{
                opacity: 0,
                filter: 'blur(10px)'
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)'
              }}
              exit={{
                opacity: 0,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 0.2
              }}
            >
              {openIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

const CircleMenu = ({
  items,
  openIcon = <Menu size={18} />,
  closeIcon = <X size={18} />
}: {
  items: Array<{ label: string; icon: React.ReactNode; href: string; onClick?: () => void }>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animate = useAnimationControls();

  const closeAnimationCallback = async () => {
    await animate.start({
      rotate: -360,
      filter: 'blur(1px)',
      transition: {
        duration: CONSTANTS.closeStagger * (items.length + 2),
        ease: 'linear'
      }
    });
    await animate.start({
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0
      }
    });
  };

  return (
    <div
      style={{
        width: CONSTANTS.itemSize + 20,
        height: CONSTANTS.itemSize + 20
      }}
      className="relative flex items-center justify-center"
    >
      <MenuTrigger
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        itemsLength={items.length}
        closeAnimationCallback={closeAnimationCallback}
        openIcon={openIcon}
        closeIcon={closeIcon}
      />
      <motion.div
        animate={animate}
        className={cn('absolute inset-0 z-0 flex items-center justify-center pointer-events-none')}
      >
        {items.map((item, index) => {
          return (
            <MenuItem
              key={`menu-item-${index}`}
              icon={item.icon}
              label={item.label}
              href={item.href}
              index={index}
              totalItems={items.length}
              isOpen={isOpen}
              onClick={() => {
                setIsOpen(false);
                closeAnimationCallback();
                if (item.onClick) item.onClick();
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export { CircleMenu };
