/**
 * Footer component
 */

import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        padding: '16px 50px',
        borderTop: '1px solid #e8e8e8',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666' }}>
        Task Management System ©{currentYear} - Built with ❤️
      </div>
    </AntFooter>
  );
}

export default Footer;