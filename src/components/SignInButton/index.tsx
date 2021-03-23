import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInButton() {
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    // se o o usuario estiver logado exibir esse button:
    <button className={styles.signInButton} type="button">
      <FaGithub color="#04d361" />
        Emanuele Correa
      <FiX color="#737388" className={styles.closeIcon}/>
    </button>
  ) : (
    // se não logado exibir esse button:
    <button className={styles.signInButton} type="button">
      <FaGithub color="#eba417" />
      Sign In with Github
    </button>
  )
}