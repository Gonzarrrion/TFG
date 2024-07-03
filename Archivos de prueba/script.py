def count_word_splits(text, line_length):
    words = text.split()
    current_length = 0
    split_count = 0
    
    for word in words:
        word_length = len(word)
        if current_length + word_length <= line_length:
            current_length += word_length + 1  # sumamos 1 por el espacio
        else:
            split_count += 1
            current_length = word_length + 1  # reiniciamos la longitud actual
            
    return split_count

def main():
    # Texto de la wikipedia
    text = """
    Una universidad es una institución académica de enseñanza superior e investigación que otorga títulos académicos en diferentes disciplinas. Se puede ubicar en uno o varios lugares llamados campus.1​ Una idea importante en la idea de universidad es la libertad de cátedra.

    La universidad moderna tiene su origen en las universidades creadas por monjes cristianos de los siglos XII y XIII, las cuales son un desarrollo de las escuelas catedralicias y escuelas monásticas.2​ Generalmente se considera que la Universidad de Bolonia, fundada en 1088, es la primera universidad del mundo en el sentido de:

    Expedir titulaciones académicas de alto nivel.
    Usar la palabra universitas, acuñada en su creación.
    Ser independiente de la educación eclesiástica, aunque buena parte de la docencia era impartida por el clero.
    Ofrecer estudios seculares como gramática, lógica o derecho.
    Definición
    El término «universidad» se deriva del latín universitās magistrōrum et scholārium, que significa ‘comunidad de Profesores y académicos’.3​ Estas comunidades eran gremios medievales que recibieron sus derechos colectivos legales por las cartas emitidas por los príncipes, prelados o las ciudades en las que se encontraban.4​ Otras ideas centrales para la definición de la institución de la universidad era la noción de libertad académica y el otorgamiento de grados académicos. Históricamente, la universidad medieval fue un producto típico de la Europa medieval y sus condiciones sociales, religiosas y políticas.5​6​7​Adoptado por todas las otras regiones globales desde el comienzo de la Edad Moderna, hay que distinguirla de las antiguas instituciones de altos estudios de otras civilizaciones que no eran en la tradición de la universidad y al que este término solo se aplica retroactivamente y no en sentido estricto.

    Denominaciones
    Existen diferentes términos utilizados para denominar a una universidad, los cuales varían según sea el país, región o incluso, el idioma predominante:8
    """

    # Longitudes de linea posibles
    line_lengths = [15, 20, 35, 40, 75, 80]
    
    # Calcular el numero de palabras cortadas para cada longitud de linea
    split_counts = {length: count_word_splits(text, length) for length in line_lengths}
    
    # Resultados
    print("Resultados de errores por longitud de línea:")
    for length, count in split_counts.items():
        print(f"Longitud {length} caracteres: {count} palabras cortadas")

if __name__ == "__main__":
    main()
