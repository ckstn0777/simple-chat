import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  email!: string;

  @Index()
  @Column({ length: 16, nullable: true })
  username?: string;

  @Column({ length: 48 })
  display_name!: string;

  @Column({ length: 255, nullable: true })
  photo_url?: string;

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Index()
  @Column()
  is_certified!: boolean;
}
