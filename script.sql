CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "Usuario" (id_usuario, cpf, nome, email, senha) VALUES
(1, '111.111.111-11', 'João Silva', 'joao.silva@teste.com', crypt('123456', gen_salt('bf'))),
(2, '222.222.222-22', 'Maria Santos', 'maria.santos@teste.com', crypt('123456', gen_salt('bf'))),
(3, '333.333.333-33', 'Carlos Oliveira', 'carlos.oliveira@teste.com', crypt('123456', gen_salt('bf'))),
(4, '444.444.444-44', 'Ana Pereira', 'ana.pereira@teste.com', crypt('123456', gen_salt('bf'))),
(5, '555.555.555-55', 'Bruno Costa', 'bruno.costa@teste.com', crypt('123456', gen_salt('bf'))),
(6, '666.666.666-66', 'Fernanda Lima', 'fernanda.lima@teste.com', crypt('123456', gen_salt('bf'))),
(7, '777.777.777-77', 'Paulo Souza', 'paulo.souza@teste.com', crypt('123456', gen_salt('bf')));

SELECT setval(pg_get_serial_sequence('"Usuario"', 'id_usuario'), 7, true);


INSERT INTO "Paciente" (id_usuario, endereco, telefone) VALUES
(1, 'Rua das Flores, 123 - São Paulo, SP', '11999990001'),
(2, 'Av. Brasil, 456 - Rio de Janeiro, RJ', '21999990002'),
(3, 'Rua Minas Gerais, 789 - Belo Horizonte, MG', '31999990003'),
(4, 'Travessa da Paz, 101 - Curitiba, PR', '41999990004'),
(5, 'Alameda dos Anjos, 202 - Salvador, BA', '71999990005'),
(6, 'Rua do Sol, 303 - Recife, PE', '81999990006'),
(7, 'Av. Central, 404 - Porto Alegre, RS', '51999990007');

INSERT INTO "Unidade" (nome, endereco) VALUES
('Hospital Central', 'Av. Paulista, 1000 - São Paulo, SP'),
('Clínica Vida Saudável', 'Rua das Acácias, 230 - Campinas, SP'),
('Unidade de Pronto Atendimento Norte', 'Av. do Estado, 500 - Rio de Janeiro, RJ'),
('Centro Médico Integrado', 'Rua 7 de Setembro, 88 - Curitiba, PR'),
('Hospital Santa Clara', 'Av. Afonso Pena, 1200 - Belo Horizonte, MG'),
('Clínica da Família Sul', 'Rua Bento Gonçalves, 340 - Porto Alegre, RS'),
('Centro de Diagnóstico Oeste', 'Av. T-63, 750 - Goiânia, GO');


INSERT INTO "Medico" (crm, nome, especialidade) VALUES
(12345, 'Dr. Roberto House', 'Infectologia'),
(67890, 'Dra. Meredith Grey', 'Cirurgia Geral'),
(11223, 'Dr. Derek Shepherd', 'Neurocirurgia'),
(44556, 'Dra. Cristina Yang', 'Cardiologia'),
(77889, 'Dr. Shaun Murphy', 'Pediatria'),
(99001, 'Dra. Lisa Cuddy', 'Endocrinologia'),
(22334, 'Dr. Gregory Green', 'Ortopedia');

INSERT INTO "CalendarioMedico" (id_medico, id_unidade, dia_semana, horario_inicio, horario_fim) VALUES
(1, 1, '2024-03-11 00:00:00', '2024-03-11 08:00:00', '2024-03-11 14:00:00'),
(2, 2, '2024-03-12 00:00:00', '2024-03-12 09:00:00', '2024-03-12 18:00:00'),
(3, 3, '2024-03-13 00:00:00', '2024-03-13 07:00:00', '2024-03-13 19:00:00'),
(4, 4, '2024-03-14 00:00:00', '2024-03-14 10:00:00', '2024-03-14 16:00:00'),
(5, 5, '2024-03-15 00:00:00', '2024-03-15 08:00:00', '2024-03-15 12:00:00'),
(6, 6, '2024-03-16 00:00:00', '2024-03-16 13:00:00', '2024-03-16 20:00:00'),
(7, 7, '2024-03-17 00:00:00', '2024-03-17 08:00:00', '2024-03-17 18:00:00');


INSERT INTO "FichaMedica" 
(id_usuario, tipo_sanguineo, data_ultimo_checkup, altura_m, peso_kg, notas_estilo_vida, contato_emerg_nome, contato_emerg_fone, alergias, condicoes_cronicas, medicamentos, vacinacoes) 
VALUES
(1, 'O+', '2023-12-01 00:00:00', 1.75, 80.5, 'Sedentário, fumante ocasional', 'Maria Silva', '11999999999', ARRAY['Penicilina'], ARRAY['Hipertensão'], ARRAY['Losartana'], ARRAY['Covid-19', 'Gripe']),
(2, 'A-', '2024-01-15 00:00:00', 1.62, 60.0, 'Pratica yoga, vegetariana', 'João Santos', '11988888888', ARRAY['Amendoim', 'Camarão'], ARRAY[]::text[], ARRAY['Vitamina D'], ARRAY['Tétano']),
(3, 'B+', '2023-11-20 00:00:00', 1.80, 92.0, 'Atleta amador, dieta rica em proteínas', 'Ana Costa', '21977777777', ARRAY[]::text[], ARRAY['Asma'], ARRAY['Bombinha SOS'], ARRAY['Febre Amarela']),
(4, 'AB+', '2024-02-10 00:00:00', 1.68, 70.0, 'Caminhadas leves, baixo consumo de álcool', 'Pedro Alves', '31966666666', ARRAY['Lactose'], ARRAY['Diabetes Tipo 2'], ARRAY['Metformina'], ARRAY['Hepatite B']),
(5, 'O-', '2023-10-05 00:00:00', 1.90, 100.0, 'Estilo de vida estressante, dorme pouco', 'Lucia Dias', '41955555555', ARRAY['Sulfa'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Covid-19 Reforço']),
(6, 'A+', '2024-01-30 00:00:00', 1.55, 55.0, 'Dieta balanceada, não fuma', 'Marcos Lima', '51944444444', ARRAY['Poeira'], ARRAY['Rinite'], ARRAY['Antialérgico'], ARRAY['HPV']),
(7, 'B-', '2023-09-12 00:00:00', 1.72, 78.0, 'Consumo moderado de café, exercícios irregulares', 'Carla Souza', '62933333333', ARRAY[]::text[], ARRAY['Enxaqueca'], ARRAY['Dipirona'], ARRAY['Meningite']);

INSERT INTO "AgendaConsulta" (id_usuario, id_calendario_medico, status, tempo_consulta) VALUES
(1, 1, 'Agendada', NULL),
(2, 2, 'Realizada', '2024-03-12 09:30:00'),
(3, 3, 'Cancelada', NULL),
(4, 4, 'Agendada', NULL),
(5, 5, 'Realizada', '2024-03-15 08:45:00'),
(6, 6, 'Agendada', NULL),
(7, 7, 'No-Show', NULL);

INSERT INTO "AgendaConsulta" (id_usuario, id_calendario_medico, status, tempo_consulta) VALUES
(1,7,'Agendada', NULL),
(1,5, 'Cancelada', NULL),
(1,2, 'Realizada', NULL);