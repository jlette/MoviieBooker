import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  movieId: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
