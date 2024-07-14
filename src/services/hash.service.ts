import bcrypt from "bcrypt";

export class HashService {
  public async hash(payload: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(payload, salt);
    return hash;
  }

  public async compare(payload: string, hash: string) {
    return await bcrypt.compare(payload, hash);
  }
}
