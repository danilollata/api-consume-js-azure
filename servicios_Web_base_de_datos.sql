create database gkserviciosyconsultoria;

use gkserviciosyconsultoria;

create table tb_repartidor (
  repartidor_id int primary key auto_increment,
  nombre varchar(50),
  apellido varchar(50),
  telefono varchar(50)
);

create table tb_estado_envio (
	estado_id int auto_increment primary key,
    nombre_estado varchar(50)
);

create table tb_envio (
  envio_id integer primary key auto_increment,
  remitente varchar(50),
  destinatario varchar(50),
  direccion_envio varchar(50),
  fecha_envio datetime,
  repartidor_id int,
  foreign key (repartidor_id) references tb_repartidor(repartidor_id),
  estado_id int,
  foreign key (estado_id) references tb_estado_envio(estado_id)

);



INSERT INTO tb_repartidor(nombre, apellido, telefono) VALUES
('carlos', 'perez', '123456789'),
('pedro', 'ramirez', '987654321'),
('nadia', 'flores', '123456789'),
('daniela', 'fiala', '123456789'),
('alexander', 'blas', '123456789');

INSERT INTO tb_estado_envio(nombre_estado) VALUES
('Pendiente'),
('En camino'),
('Entregado'),
('Cancelado'),
('Devuelto');

INSERT INTO tb_envio(remitente, destinatario, direccion_envio, fecha_envio, repartidor_id, estado_id) VALUES
('Juan López', 'María Pérez', 'Av. Los Robles 101', '2025-04-11 10:00:00', 1, 1),
('Luis Torres', 'Ana Ruiz', 'Calle Miraflores 222', '2025-04-10 09:30:00', 2, 1),
('Carmen Vela', 'José Luján', 'Jr. Arequipa 333', '2025-04-09 14:15:00', 3, 1),
('Erick Díaz', 'Laura Campos', 'Av. Primavera 444', '2025-04-08 08:00:00', 4, 1),
('Marta León', 'Iván Castro', 'Calle San Borja 555', '2025-04-07 16:45:00', 5, 1);



-- PROCEDIMIENTOS ALMACENADOS

-- combo list

delimiter $$
create procedure sp_cbox_listar_estado_envio()
begin
	select * from tb_estado_envio;
end $$
delimiter ;

delimiter $$
create procedure sp_cbox_listar_repartidor()
begin 
	select * from tb_repartidor;
end $$
delimiter ;

-- ENVIO SP

delimiter $$
create procedure sp_listar_envio()
begin 
	select en.envio_id, en.remitente, en.destinatario, en.direccion_envio,
    en.fecha_envio, re.nombre nombre_repartidor, re.apellido apellido_repartidor, es.nombre_estado estado
    from tb_envio en inner join tb_repartidor re on re.repartidor_id = en.repartidor_id
    inner join tb_estado_envio es  on es.estado_id = en.estado_id;
    
end $$
delimiter ;  

call sp_listar_envio
drop procedure sp_listar_envio_por_id
delimiter $$
create procedure sp_listar_envio_por_id(
	in envId int
) 
begin
select en.envio_id, en.remitente, en.destinatario, en.direccion_envio,
    en.fecha_envio, re.nombre nombre_repartidor, re.apellido apellido_repartidor, es.nombre_estado estado
    from tb_envio en inner join tb_repartidor re on re.repartidor_id = en.repartidor_id
    inner join tb_estado_envio es  on es.estado_id = en.estado_id where envio_id = envId;
end $$
delimiter ;

delimiter $$
create procedure sp_crear_envio(
	
	in rem varchar(50),
    in dest varchar(50),
    in direcEnv varchar(50),
	in fecEnv  date,
    in repId int,
    in estId int
)
begin
 
	insert into tb_envio(remitente, destinatario, direccion_envio, fecha_envio, repartidor_id, estado_id)
    values(rem, dest, direcEnv, fecEnv, repId, estId);
end $$
delimiter ;

delimiter $$
create procedure sp_actualizar_envio(
	
	in rem varchar(50),
    in dest varchar(50),
    in direcEnv varchar(50),
	in fecEnv  date,
    in repId int,
    in estId int,
    in envId int
)
begin 
	update tb_envio 
    set
		remitente = rem,
        destinatario = dest,
        direccion_envio = direcEnv,
        fecha_envio = fecEnv,
        repartidor_id = repId,
        estado_id = estId
	where envio_id =  envId;
end $$
delimiter ;  

delimiter $$
create procedure sp_eliminar_envio(
	envId int
)
begin 
	delete from tb_envio where envio_id = envId;

end $$
delimiter ;


