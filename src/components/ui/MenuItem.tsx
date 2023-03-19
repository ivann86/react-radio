import { MouseEventHandler, PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuItem.module.css';

type MenuItemProps = PropsWithChildren & {
  href?: string;
  active?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
};

export default function MenuItem({
  href = '#',
  active = false,
  isActive = false,
  children,
  className,
  onClick,
}: MenuItemProps) {
  let classes = styles['menu-item'];
  if (className) classes += ' ' + className;

  return (
    <NavLink
      to={href}
      className={({ isActive }) => (isActive ? classes + ' ' + styles.active : classes)}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}
