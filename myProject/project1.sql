drop database if exists project1;
create database project1 default character set utf8 collate utf8_general_ci;
drop user if exists 'staff'@'localhost';
create user 'staff'@'localhost' identified by 'pw';
grant all on project1.* to 'staff'@'localhost';
use project1;

drop table if exists users;
create table users (
	id int auto_increment,
	login varchar(100) not null unique,
	name varchar(100) not null,
	hash varchar(255) not null,
	primary key(id)
);
insert into users values(null, 'guest', 'ゲスト', '$2y$10$Hyioib74muFJKvmqv39h9OzmvHTQk.cgmcwkYRdWonZOzzJDmArgW');
insert into users values(null, 'hiyoko', 'ぴよぴよさん', '$2y$10$yZhSE.mfekxvCKplqcvsi.eteCLtbZphAXld/KgGHMrvBWQvlX3Va');
insert into users values(null, 'DragonBowl', 'ドラゴン', '$2y$10$VYTZjxazraE5aTJ8Hjcxpumu7Sb8rm13LcifB4YOsYjlT87DBq686');


drop table if exists profile;
create table profile (
	profile_id int auto_increment,
	iconRadius tinyint DEFAULT 10,
	iconX FLOAT NOT NULL DEFAULT 0,
	iconY FLOAT NOT NULL DEFAULT 0,
	scale FLOAT NOT NULL DEFAULT 1,
	message VARCHAR(30) DEFAULT '初めまして！',
	iconBgColor char(7) DEFAULT '#ffffff',
	primary key(profile_id),
	foreign key(profile_id) references users(id)
);
insert into profile (profile_id, iconRadius, message) values(1, 10, 'ゲストアカウントのプロフィールは変更できません。');
insert into profile (profile_id, iconRadius, message) values(2, 25, 'ピヨピヨ！');
insert into profile (profile_id, iconRadius, message) values(3, 50, '願いを言え');


drop table if exists trivia;
create table trivia (
	user_id int,
	date DATE,
	content varchar (200),
	primary key(user_id, date),
	foreign key(user_id) references users(id)
);
insert into trivia (user_id, date, content) values(1, '2024-01-01', 'パイナップルは美味しい');

drop table if exists ranking;
create table ranking (
	number int auto_increment,
	user_id int,
	score int,
	primary key(number),
	foreign key(user_id) references users(id)
);
insert into ranking values(null, 1, 100);
insert into ranking values(null, 1, 200);
insert into ranking values(null, 1, 300);
insert into ranking values(null, 1, 400);
insert into ranking values(null, 1, 500);


--パスワード 
--guest-animalFestival5
--hiyoko-hiyoko1
--DragonBawl, ryuuwan7