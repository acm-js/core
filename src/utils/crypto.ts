import crypto from 'crypto';

export function md5 (value: string): string {
  return crypto.createHash( 'md5' )
    .update( value, 'utf8' )
    .digest( 'hex' );
}

export function sha1 (value: string): string {
  return crypto.createHash( 'sha1' )
    .update( value, 'utf8' )
    .digest( 'hex' )
}

export function generateKey(bufferSize = 16, encoding = 'hex'): string {
  return crypto.randomBytes(bufferSize).toString(encoding);
}
